import { HttpStatus, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

import { UploaderRepository } from './repository/uploader.repository';
import { UploadFileInput } from './dto/uploaded-file-input';

@Injectable()
export class UploaderService {
  constructor(
    private repository: UploaderRepository,
    private readonly pubSub: PubSub,
    private readonly configService: ConfigService,
  ) {
    const databaseHost = this.configService.get('database.host', 'localhost');
    console.log(databaseHost);
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];

    return new Promise(async (resolve, reject) =>
      // listen for stream events
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }

  async uploadFile(uploadFileInput: UploadFileInput) {
    const { createReadStream, filename, mimetype } = uploadFileInput;
    const client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    const buffer = await this.streamToBuffer(createReadStream());
    const fileStream = await createReadStream();

    const uploadParams = {
      Key: `${uuid()}-${filename}`,
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: fileStream,
      ContentType: mimetype,
      ContentLength: buffer.length,
    };

    const command = new PutObjectCommand(uploadParams);
    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        const uploadedFileUrl = `https://${this.configService.get(
          'AWS_BUCKET_NAME',
        )}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${
          uploadParams.Key
        }}`;

        const fileStorageInDB = {
          fileName: uploadFileInput.filename,
          fileUrl: uploadedFileUrl,
          key: uploadParams.Key,
        };

        const filestored = await this.repository.uploadFile({
          data: fileStorageInDB,
        });
        return filestored;
      } else {
        throw new Error('File not saved to S3');
      }
    } catch (error) {
      throw error;
    }
  }
}
