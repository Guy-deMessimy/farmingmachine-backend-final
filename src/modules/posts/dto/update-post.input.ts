import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType()
export class updatePostInput extends PartialType(CreatePostInput) {}
