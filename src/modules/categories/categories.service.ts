import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class CategoriesService {
  constructor(
    private repository: CategoriesRepository,
    private readonly pubSub: PubSub,
  ) {}

  async getCategories() {
    const categories = await this.repository.getCategories({});
    return categories;
  }
}
