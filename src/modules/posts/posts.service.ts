import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PostsRepository } from './posts.repository';
import { CreatePostInput } from './dto/create-post.input';

@Injectable()
export class PostsService {
  constructor(private repository: PostsRepository) {}

  async createPost(params: {
    content: Post[`content`];
    title: Post[`title`];
    authorId: User[`id`];
  }) {
    const { content, authorId, title } = params;

    // call repository layer
    const post = await this.repository.createPost({
      data: {
        title,
        content,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    return post;
  }

  async getPosts() {
    const posts = await this.repository.getPosts({});
    return posts;
  }
}
