import { Module } from '@nestjs/common';
import { PostsModule } from 'src/modules/posts/posts.module';
import { ApiResolver } from './api.resolver';

@Module({
  imports: [PostsModule],
  providers: [ApiResolver],
})
export class ApiModule {}
