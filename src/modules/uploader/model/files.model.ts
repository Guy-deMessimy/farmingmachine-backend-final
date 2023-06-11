import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { File as FileDB } from '@prisma/client';

@ObjectType({ description: 'File model' })
export class UploadedFile {
  @Field(() => Int)
  id: FileDB[`id`];

  @Field(() => String)
  fileName: FileDB[`fileName`];

  @Field(() => String)
  fileUrl: FileDB[`fileUrl`];

  @Field(() => String)
  key: FileDB[`key`];

  @Field(() => GraphQLISODateTime)
  createdAt: FileDB[`createdAt`];

  @Field(() => GraphQLISODateTime)
  updatedAt: FileDB[`updatedAt`];
}
