import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { CategoriesRepository } from './repository/categories.repository';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [CategoriesRepository, CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
