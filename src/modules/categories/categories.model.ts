import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category as CategoryDB, File as FileDB } from '@prisma/client';
import { UploadedFile } from '../uploader/model/files.model';

@ObjectType({ description: 'Category model' })
export class Category {
  @Field(() => Int)
  id: CategoryDB[`id`];

  @Field(() => String)
  title: CategoryDB[`title`];

  @Field(() => String)
  description: CategoryDB[`description`];

  @Field(() => UploadedFile)
  file: [FileDB];
}
