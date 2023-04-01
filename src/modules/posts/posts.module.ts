import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PostsRepository, PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
