import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // Assumes that env variables are retrieved from the config module.
  // imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
