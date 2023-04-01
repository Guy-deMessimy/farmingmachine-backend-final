import { Query, Resolver } from '@nestjs/graphql';
import { Post } from 'src/modules/posts/posts.model';
import { PostsService } from 'src/modules/posts/posts.service';

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}
  @Query(() => [Post])
  async getPosts() {
    return this.postsService.getPosts();
  }
}
