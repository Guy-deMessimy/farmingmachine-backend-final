// const mySQL = require('../middlewares/database/mysql');
// const config = require('../config/environment/index');
// const logger = require('../config/logger');
// const slack = require('../lib/hookSlack');
// const BankDao = require('../dao/bank-dao');
// const { EMAIL_TEMPLATE_CODE } = require('../config/constant');
// const OperationStatusHistoryDao = require('../dao/operation-status-history-dao');

const getAllOperationsBySubdomain = async (bank) => {
  const bankDb = await mySQL.getDb(bank.subdomain);
  const [operations] = await bankDb.query({
    sql: `SELECT o.investmentLinkId, ol.bank_domain, o.status
    FROM operations o
    INNER JOIN operation_link ol ON ol.uuid = o.investmentLinkId
    WHERE ol.bank_domain = ?`,
    values: [bank.subdomain],
  });
  return operations;
};

const getInvestorReminderEmailsByInvestmentsLinkId = async (
  investmentsLinkId,
) => {
  const commonDb = await mySQL.getCommonDb();
  const [reminderOccurences] = await commonDb.query({
    sql: `SELECT investment_link_id AS investment_link_id, COUNT(*) AS count, e.template_code
        FROM emails_investment_links_assoc eia
        INNER JOIN emails e ON e.mailjet_uuid = eia.mailjet_uuid 
        WHERE eia.investment_link_id IN (?) 
        AND e.template_code IN ('INVESTOR_REMINDER')
        GROUP BY e.template_code, eia.investment_link_id;`,
    values: [investmentsLinkId],
  });
  return reminderOccurences;
};

const getCompanyReminderEmailsByInvestmentsLinkId = async (
  investmentsLinkId,
) => {
  const commonDb = await mySQL.getCommonDb();
  const [reminderOccurences] = await commonDb.query({
    sql: `SELECT eia.investment_link_id AS investment_link_id, COUNT(DISTINCT e.id) AS count, e.template_code, e.createdAt
        FROM emails_investment_links_assoc eia
        INNER JOIN emails e ON e.mailjet_uuid = eia.mailjet_uuid 
        WHERE eia.investment_link_id IN (?) 
        AND e.template_code IN ('COMPANY_REMINDER', 'COMPANY_REMINDER_STAGE_2')
        AND (SELECT  MAX(s.createdAt) FROM steps s WHERE s.investment_link_id = eia.investment_link_id) < e.createdAt
        GROUP BY eia.investment_link_id;`,
    values: [investmentsLinkId],
  });
  return reminderOccurences;
};

const initReminderCounter = async (
  bank,
  column,
  counter,
  investmentsLinkId,
) => {
  if (investmentsLinkId.length === 0) {
    return [];
  }
  const bankDb = await mySQL.getDb(bank.subdomain);
  const [initCount] = await bankDb.query({
    sql: `UPDATE operations o SET o.?? = ?
    WHERE o.investmentLinkId IN (?);`,
    values: [column, counter, investmentsLinkId],
  });

  return initCount && initCount.affectedRows >= 1;
};

const updateReminderCounter = async (bank) => {
  const operations = await getAllOperationsBySubdomain(bank);
  const investmentLinkIdStatusInvestor = operations
    .filter(
      (investment) =>
        investment.status === OperationStatusHistoryDao.status.WAITING_DOCUMENT,
    )
    .map((ope) => ope.investmentLinkId);
  const investmentLinkIdStatusCompanyS1 = operations
    .filter(
      (investment) =>
        investment.status === OperationStatusHistoryDao.status.INVESTOR_SIGNED,
    )
    .map((ope) => ope.investmentLinkId);
  const investmentLinkIdStatusCompanyS2 = operations
    .filter(
      (investment) =>
        investment.status === OperationStatusHistoryDao.status.PAYMENT_RECEIVED,
    )
    .map((ope) => ope.investmentLinkId);

  const reminderColumn = {
    investorCounter: `investor_reminder_counter`,
    companyCounterS1: `company_reminder_s1_counter`,
    companyCounterS2: `company_reminder_s2_counter`,
  };

  const initInvestorReminderCounter = async () => {
    if (investmentLinkIdStatusInvestor.length) {
      const reminder = await getInvestorReminderEmailsByInvestmentsLinkId(
        investmentLinkIdStatusInvestor,
      );
      await Promise.all(
        reminder.map(async (task) => {
          if (task.template_code === EMAIL_TEMPLATE_CODE.INVESTOR_REMINDER) {
            await initReminderCounter(
              bank,
              reminderColumn.investorCounter,
              task.count,
              task.investment_link_id,
            );
          }
          await slack.sendToSlack(
            `Task for ${task.investment_link_id} : investor reminder counter have been incremented`,
            false,
          );
        }),
      );
    }
  };

  const initCompanyS1ReminderCounter = async () => {
    if (investmentLinkIdStatusCompanyS1.length) {
      const reminder = await getCompanyReminderEmailsByInvestmentsLinkId(
        investmentLinkIdStatusCompanyS1,
      );
      await Promise.all(
        reminder.map(async (task) => {
          if (
            task.template_code === EMAIL_TEMPLATE_CODE.COMPANY_REMINDER ||
            task.template_code === EMAIL_TEMPLATE_CODE.COMPANY_REMINDER_STAGE_2
          ) {
            await initReminderCounter(
              bank,
              reminderColumn.companyCounterS1,
              task.count,
              task.investment_link_id,
            );
          }
          await slack.sendToSlack(
            `Task for ${task.investment_link_id} : company reminder stage 1 counter have been incremented`,
            false,
          );
        }),
      );
    }
  };

  const initCompanyS2ReminderCounter = async () => {
    if (investmentLinkIdStatusCompanyS2.length) {
      const reminder = await getCompanyReminderEmailsByInvestmentsLinkId(
        investmentLinkIdStatusCompanyS2,
      );
      await Promise.all(
        reminder.map(async (task) => {
          if (
            task.template_code === EMAIL_TEMPLATE_CODE.COMPANY_REMINDER_STAGE_2
          ) {
            await initReminderCounter(
              bank,
              reminderColumn.companyCounterS2,
              task.count,
              task.investment_link_id,
            );
          }
          await slack.sendToSlack(
            `Task for ${task.investment_link_id} : company reminder stage 2 counter have been incremented`,
            false,
          );
        }),
      );
    }
  };

  const arrayPromiseIncrement = [];
  arrayPromiseIncrement.push(initInvestorReminderCounter());
  arrayPromiseIncrement.push(initCompanyS1ReminderCounter());
  arrayPromiseIncrement.push(initCompanyS2ReminderCounter());
  await Promise.all(arrayPromiseIncrement);
};

const start = async () => {
  await mySQL.connectDb();
  await slack.sendToSlack(`Init reminder counter increment: cron start`);
  const banks = await BankDao.getAllBanksKit();

  await banks.reduce(async (lastPromise, bank) => {
    await lastPromise;
    return updateReminderCounter(bank);
  }, Promise.resolve());
};
logger.info('instanceNumber', config.instanceNumber);
if (config.instanceNumber === '0') {
  start().then(
    () => {
      slack
        .sendToSlack('Init reminder counter increment: cron terminate', false)
        .then(
          () => {
            process.exit(0);
          },
          (errorSlack) => {
            logger.error(errorSlack);
            process.exit(0);
          },
        );
    },
    (error) => {
      slack
        .sendToSlack(
          `Init reminder counter increment: error in cron: ${error.message}, ${error.stack}`,
          true,
        )
        .then(
          () => {
            process.exit(1);
          },
          (errorSlack) => {
            logger.error(errorSlack);
            process.exit(1);
          },
        );
    },
  );
} else {
  process.exit(0);
}
