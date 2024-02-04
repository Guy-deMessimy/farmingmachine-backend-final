import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'node:util';
import { CATEGORY } from './category';
import { v4 as uuid } from 'uuid';
import { FILE } from './file';
import { SERVICE } from './service';

const prisma = new PrismaClient();

const main = async () => {
  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: {
        type: 'string',
      },
    },
  });

  switch (environment) {
    case 'development':
      const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},

        create: {
          email: 'alice@prisma.io',
          name: 'Alice',

          posts: {
            create: {
              title: 'Check out Prisma with Next.js',
              content: 'https://www.prisma.io/nextjs',
              published: true,
            },
          },
        },
      });
      const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},

        create: {
          email: 'bob@prisma.io',
          name: 'Bob',

          posts: {
            create: [
              {
                title: 'Follow Prisma on Twitter',
                content: 'https://twitter.com/prisma',
                published: true,
              },

              {
                title: 'Follow Nexus on Twitter',
                content: 'https://twitter.com/nexusgql',
                published: true,
              },
            ],
          },
        },
      });

      const seedFile = async () => {
        const uplodedFile = Promise.all(
          FILE.map(
            async (n) =>
              await prisma.file.create({
                data: {
                  fileName: n.fileName,
                  fileUrl: n.fileUrl,
                  key: `${uuid()}-${n.fileName}`,
                },
              }),
          ),
        );
        return uplodedFile;
      };

      await seedFile();

      const seedCategory = async () => {
        Promise.all(
          CATEGORY.map(
            async (n) =>
              await prisma.category.create({
                data: {
                  title: n.title,
                  description: n.description,
                },
              }),
          ),
        )
          .then(() =>
            console.info('[SEED] Succussfully create category records'),
          )
          .catch((e) =>
            console.error('[SEED] Failed to create category records', e),
          );
      };

      seedCategory();

      // const seedService = async () => {
      //   Promise.all(
      //     SERVICE.map(
      //       async (n) =>
      //         await prisma.service.create({
      //           data: {
      //             title: n.title,
      //             description: n.description,
      //             category: n.category,
      //           },
      //         }),
      //     ),
      //   )
      //     .then(() =>
      //       console.info('[SEED] Succussfully create category records'),
      //     )
      //     .catch((e) =>
      //       console.error('[SEED] Failed to create category records', e),
      //     );
      // };

      // seedService();
      console.log({ alice, bob });
      break;

    case 'test':
      break;

    default:
      break;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
