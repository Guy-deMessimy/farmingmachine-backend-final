import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Post } from '../../modules/posts/posts.model';
import { PostsService } from '../../modules/posts/posts.service';

@Resolver()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Post])
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Mutation(() => Post, { name: 'createPost' })
  async createPost(
    @Args({ name: `content`, type: () => String }) content: string,
    @Args({ name: `title`, type: () => String }) title: string,
    @Args({ name: `authorId`, type: () => Int }) authorId: number,
  ) {
    return this.postsService.createPost({ content, title, authorId });
  }

  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator('postAdded');
  }
}
