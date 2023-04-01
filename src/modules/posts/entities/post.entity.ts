import { Prisma } from '@prisma/client';

export class PostInput {
  limit?: number;
  offset?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
}
