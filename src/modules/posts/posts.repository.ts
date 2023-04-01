import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostInput } from './entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

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
