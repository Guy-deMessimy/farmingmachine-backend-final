import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadFileInput } from 'src/modules/uploader/dto/uploaded-file-input';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {
    const databaseHost = this.configService.get('database.host', 'localhost');
    console.log(databaseHost);
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];

    return new Promise(async (resolve, reject) =>
      // listen for stream events and create file Buffer
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
    const key = `${uuid()}-${filename}`;

    const uploadParams = {
      Key: key,
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

        return { uploadedFileUrl, key };
      } else {
        throw new Error('File not saved to S3');
      }
    } catch (error) {
      throw error;
    }
  }
}
