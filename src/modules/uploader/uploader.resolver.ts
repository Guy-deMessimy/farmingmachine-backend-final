import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UploaderService } from './uploader.service';
import { UploadedFile } from '../../modules/uploader/model/files.model';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { File } from '@prisma/client';

@Resolver()
export class UploaderResolver {
  constructor(private readonly uploaderService: UploaderService) {}

  @Mutation(() => UploadedFile, { name: 'uploadFile' })
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: `size`, type: () => Int }) size: number,
  ): Promise<File> {
    const uploadedFile = this.uploaderService.uploadFile(file, size);
    return uploadedFile;
  }
}
