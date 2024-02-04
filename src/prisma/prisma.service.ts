import {
  INestApplication,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

// Need to see https://docs.nestjs.com/techniques/configuration#using-the-configservice
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  // constructor() {
  //   super({
  //     log: [
  //       // type of event you would like to log.
  //       { emit: 'event', level: 'query' },
  //       { emit: 'stdout', level: 'info' },
  //       { emit: 'stdout', level: 'warn' },
  //       { emit: 'stdout', level: 'error' },
  //     ],
  //     errorFormat: 'colorless',
  //   });
  // }
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await this.$connect();

    this.$on('error', ({ message }) => {
      this.logger.error(message);
    });
    this.$on('warn', ({ message }) => {
      this.logger.warn(message);
    });
    this.$on('info', ({ message }) => {
      this.logger.debug(message);
    });
    this.$on('query', ({ query, params }) => {
      this.logger.log(`${query}; ${params}`);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
