import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UploadedFile } from '../model/files.model';
// import { FileUploadDto } from '../dto/upload-file-input';

@Injectable()
export class UploaderRepository {
  constructor(private prisma: PrismaService) {
    prisma.$on<any>('query', (event: Prisma.QueryEvent) => {
      console.log('Query: ' + event.query);
      console.log('Duration: ' + event.duration + 'ms');
    });
  }

  async uploadFile(params: { data: Prisma.FileCreateInput }): Promise<File> {
    const { data } = params;
    return this.prisma.file.create({ data });
  }
}
