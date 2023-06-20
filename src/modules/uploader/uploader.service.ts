import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ConfigService } from '@nestjs/config';
import { UploaderRepository } from './repository/uploader.repository';
import { UploadFileInput } from './dto/uploaded-file-input';
import { S3Service } from '../../s3/s3.service';

@Injectable()
export class UploaderService {
  constructor(
    private repository: UploaderRepository,
    private readonly pubSub: PubSub,
    private readonly configService: ConfigService,
    private readonly S3Service: S3Service,
  ) {
    const databaseHost = this.configService.get('database.host', 'localhost');
    console.log(databaseHost);
  }

  async uploadFile(uploadFileInput: UploadFileInput) {
    try {
      const result = await this.S3Service.uploadImage(uploadFileInput);

      if (result) {
        const signedUrl = await this.S3Service.getSignedFileUrl(result.key);
        if (signedUrl) {
          const fileStorageInDB = {
            fileName: uploadFileInput.filename,
            fileUrl: signedUrl,
            key: result.key,
          };
          const filestored = await this.repository.uploadFile({
            data: fileStorageInDB,
          });
          return filestored;
        }
      } else {
        throw new Error('File url not saved into db');
      }
    } catch (error) {
      if (error) {
        console.log(error);
        throw error;
      }
    }
  }
}
