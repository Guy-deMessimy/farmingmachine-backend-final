import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule],
  providers: [PostsRepository, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
