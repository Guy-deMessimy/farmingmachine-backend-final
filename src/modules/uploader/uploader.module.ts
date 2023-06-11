import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PubSubModule } from 'src/modules/pub-sub/pub-sub.module';
import { ConfigModule } from '@nestjs/config';
import { UploaderRepository } from './repository/uploader.repository';
import { UploaderService } from './uploader.service';
import { UploaderResolver } from './uploader.resolver';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, PubSubModule, ConfigModule, S3Module],
  providers: [UploaderRepository, UploaderService, UploaderResolver],
  exports: [UploaderService],
})
export class UploaderModule {}
