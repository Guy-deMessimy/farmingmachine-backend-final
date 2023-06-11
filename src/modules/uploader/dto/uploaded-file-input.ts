import { InputType } from '@nestjs/graphql';
import { Readable } from 'stream';

@InputType({ description: 'Create uploadFile input object type.' })
export class UploadFileInput {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
