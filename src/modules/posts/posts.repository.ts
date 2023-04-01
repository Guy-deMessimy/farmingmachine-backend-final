import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostInput } from './entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async createPost(params: { data: Prisma.PostCreateInput }): Promise<Post> {
    const { data } = params;
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
