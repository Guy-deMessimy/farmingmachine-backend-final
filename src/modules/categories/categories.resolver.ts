import { Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { PubSub } from 'graphql-subscriptions';
import { Category } from './model/categories.model';

@Resolver()
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Category])
  async getCategories() {
    return this.categoriesService.getCategories();
  }
}
