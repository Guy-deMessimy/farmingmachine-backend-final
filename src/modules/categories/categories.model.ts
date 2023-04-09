import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Category as CategoryDB } from '@prisma/client';

@ObjectType({ description: 'Category model' })
export class Category {
  @Field(() => Int)
  id: CategoryDB[`id`];

  @Field(() => String)
  title: CategoryDB[`title`];

  @Field(() => String)
  description: CategoryDB[`description`];
}
