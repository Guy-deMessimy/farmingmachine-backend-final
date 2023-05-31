import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PubSubModule } from 'src/modules/pub-sub/pub-sub.module';
import { ConfigModule } from '@nestjs/config';
import { UploaderRepository } from './repository/uploader.repository';
import { UploaderService } from './uploader.service';
import { UploaderResolver } from './uploader.resolver';

@Module({
  imports: [PrismaModule, PubSubModule, ConfigModule],
  providers: [UploaderRepository, UploaderService, UploaderResolver],
  exports: [UploaderService],
})
export class UploaderModule {}
