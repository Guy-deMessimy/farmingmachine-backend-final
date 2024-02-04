import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CategoryInput } from '../dto/category.entity';
// import { PostInput } from './entities/post.entity';

@Injectable()
export class CategoriesRepository {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async getCategories(params: CategoryInput): Promise<Category[]> {
    const { limit, offset, cursor, where, orderBy } = params;
    return this.prisma.category.findMany({
      include: { file: { select: { fileUrl: true, key: true } } },
      skip: limit,
      take: offset,
      // cursor,
      // where,
      orderBy,
    });
  }
}
