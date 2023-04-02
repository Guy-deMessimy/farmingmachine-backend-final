import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({ description: 'Create post input object type.' })
export class CreatePostInput {
  @Field((type) => ID, { description: 'A new post name' })
  title: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  published?: boolean;
  authorId?: number;
}
