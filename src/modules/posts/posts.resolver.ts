import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from 'src/modules/posts/posts.model';
import { PostsService } from 'src/modules/posts/posts.service';
import { CreatePostInput } from './dto/create-post.input';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Post])
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Mutation(() => Post, { name: 'createPost' })
  async createPost(
    @Args({ name: `content`, type: () => String }) content: string,
    @Args({ name: `title`, type: () => String }) title: string,
    @Args({ name: `authorId`, type: () => Int }) authorId: number,
    // @Args({ name: `createPostInput` }) createPostInput: CreatePostInput,
  ) {
    return this.postsService.createPost({ content, title, authorId });
  }
}
