import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Post as PostDB } from '@prisma/client';

@ObjectType({ description: 'Post model' })
export class Post {
  @Field(() => Int)
  id: PostDB[`id`];

  @Field(() => GraphQLISODateTime)
  createdAt: PostDB[`createdAt`];

  @Field(() => GraphQLISODateTime)
  updatedAt: PostDB[`updatedAt`];

  @Field(() => String)
  content: PostDB[`content`];

  @Field(() => String)
  title: PostDB[`title`];

  @Field(() => Int)
  authorId: PostDB[`authorId`];

  @Field(() => Boolean)
  published: PostDB[`published`];
}
