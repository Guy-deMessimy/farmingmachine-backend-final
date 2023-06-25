import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'node:util';
import { CATEGORY } from './category';

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
      const seedCategory = async () => {
        Promise.all(
          CATEGORY.map((n) =>
            prisma.category.create({
              data: { title: n.title, description: n.description },
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
