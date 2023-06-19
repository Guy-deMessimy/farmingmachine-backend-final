import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadFileInput } from 'src/modules/uploader/dto/uploaded-file-input';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {
    const databaseHost = this.configService.get('database.host', 'localhost');
    console.log(databaseHost);
  }

  async s3Client() {
    return new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(uploadFileInput: UploadFileInput, size: number) {
    const { createReadStream, filename, mimetype } = uploadFileInput;
    const s3Client = await this.s3Client();

    const fileStream = await createReadStream();
    const key = `${uuid()}-${filename}`;

    const uploadParams = {
      Key: key,
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: fileStream,
      ContentType: mimetype,
      ContentLength: size,
    };

    const command = new PutObjectCommand(uploadParams);
    try {
      const response = await s3Client.send(command);
      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        const uploadedFileUrl = `https://${this.configService.get(
          'AWS_BUCKET_NAME',
        )}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${
          uploadParams.Key
        }`;

        return { uploadedFileUrl, key };
      } else {
        throw new Error('File not saved to S3');
      }
    } catch (error) {
      throw error;
    }
  }

  async getSignedFileUrl(fileName: string) {
    const s3Client = await this.s3Client();
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileName,
    });

    try {
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 900,
      });
      return signedUrl;
    } catch (error) {
      console.log(error);
    }
  }
}
