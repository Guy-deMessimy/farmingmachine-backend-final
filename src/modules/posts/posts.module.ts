import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { PubSubModule } from '../pub-sub/pub-sub.module';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [PostsRepository, PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
