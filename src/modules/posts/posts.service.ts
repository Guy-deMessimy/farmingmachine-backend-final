import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostInput } from './dto/create-post.input';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PostsService {
  constructor(
    private repository: PostsRepository,
    private readonly pubSub: PubSub,
  ) {}

  async createPost(createPostInput: CreatePostInput) {
    const { content, authorId, title } = createPostInput;

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

    this.pubSub.publish('postAdded', { postAdded: post });
    return post;
  }

  async getPosts() {
    const posts = await this.repository.getPosts({});
    return posts;
  }
}
