import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private repository: PostsRepository) {}

  async getPosts() {
    const tweets = await this.repository.getPosts({});
    return tweets;
  }
}
