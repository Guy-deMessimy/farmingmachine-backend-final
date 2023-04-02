import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostInput } from './dto/create-post.input';

@Injectable()
export class PostsService {
  constructor(private repository: PostsRepository) {}

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

    return post;
  }

  async getPosts() {
    const posts = await this.repository.getPosts({});
    return posts;
  }
}
