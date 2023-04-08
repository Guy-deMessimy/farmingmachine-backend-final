import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PostInput } from './entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async createPost(params: { data: Prisma.PostCreateInput }): Promise<Post> {
    const { data } = params;
    if (data && data.content && data.content.length > 80) {
      throw new Error(`Tweet too long`);
    }
    return this.prisma.post.create({ data });
  }

  async getPosts(params: PostInput): Promise<Post[]> {
    const { limit, offset, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip: limit,
      take: offset,
      cursor,
      where,
      orderBy,
    });
  }
}
