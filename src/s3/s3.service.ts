import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import sharp from 'sharp';
import { UploadFileInput } from 'src/modules/uploader/dto/uploaded-file-input';
import { RatioEnum } from './enums/s3-enum';
import { IMAGE_SIZE, MAX_WIDTH, QUALITY_ARRAY } from './constants/s3-constants';
import { uploadedFile } from './model/upload-file-model';

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

  private static validateImage(mimetype: string): string | false {
    const val = mimetype.split('/');
    if (val[0] !== 'image') {
      return false;
    }
    return val[1] ?? false;
  }

  private static async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }

  private static async compressImage(
    buffer: Buffer,
    ratio?: number,
  ): Promise<Buffer> {
    let compressBuffer: sharp.Sharp | Buffer = sharp(buffer).jpeg({
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
    });

    if (ratio) {
      compressBuffer.resize({
        width: MAX_WIDTH,
        height: Math.round(MAX_WIDTH * ratio),
        fit: 'cover',
      });
    }

    compressBuffer = await compressBuffer.toBuffer();

    if (compressBuffer.length > IMAGE_SIZE) {
      for (let i = 0; i < QUALITY_ARRAY.length; i++) {
        const quality = QUALITY_ARRAY[i];
        const smallerBuffer = await sharp(compressBuffer)
          .jpeg({
            quality,
            chromaSubsampling: '4:4:4',
          })
          .toBuffer();

        if (smallerBuffer.length <= IMAGE_SIZE || quality === 10) {
          compressBuffer = smallerBuffer;
          break;
        }
      }
    }
    return compressBuffer;
  }

  public async uploadImage(
    uploadFileInput: UploadFileInput,
    ratio?: RatioEnum,
  ): Promise<uploadedFile | undefined> {
    const { createReadStream, filename, mimetype } = uploadFileInput;
    const imageType = S3Service.validateImage(mimetype);

    if (!imageType) {
      throw new BadRequestException('Please upload a valid image');
    }

    try {
      return await this.uploadFile(
        await S3Service.compressImage(
          await S3Service.streamToBuffer(createReadStream()),
          ratio,
        ),
        filename,
        mimetype,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async uploadFile(fileBuffer: Buffer, filename: string, fileExt: string) {
    const s3Client = await this.s3Client();

    const key = `${uuid()}-${filename}`;

    const uploadParams = {
      Key: key,
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: fileBuffer,
      ContentType: fileExt,
      ContentLength: fileBuffer.byteLength,
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
      if (error) {
        console.log(error);
        throw error;
      }
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
