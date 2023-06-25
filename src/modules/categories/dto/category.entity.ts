import { Prisma } from '@prisma/client';

export class CategoryInput {
  limit?: number;
  offset?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
}
