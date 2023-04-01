import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private repository: PostsRepository) {}

  async getPosts() {
    const posts = await this.repository.getPosts({});
    return posts;
  }
}
