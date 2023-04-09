import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { mockDeep } from 'jest-mock-extended';

describe('PostsService', () => {
  let post: PostsService;
  //   let user;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    })
      .overrideProvider(PostsService)
      .useValue(mockDeep<PostsService>())
      .compile();

    post = module.get<PostsService>(PostsService);
    //   user = module.get>UsersService>(UsersService)
  });

  describe('createPost', () => {
    // let userId: number;
    // const dto: CreatePostDto = {
    //   title: 'todo',
    //   description: 'First post',
    // createdAt: new Date(),
    // updatedAt: new Date(),
    // content: `Hello world, this is a post.`,
    // title: `First post.`,
    // authorId: 1234,
    // published: true,
    // };
    it('should be defined', () => {
      expect(post).toBeDefined();
    });
    it.skip('should create user', async () => {
      //   const user = await user.create({
      //     data: {},
      //   });
      //   const customer = await customer.create({
      //     data: {},
      //   });
      //   userId = user.id;
    });
    it.skip('should create post', async () => {
      //   const getPosts = await post.createPost(userId, dto);
      //   await expect(getPosts.title).resolves.toBe(dto.title);
    });
  });
});
