import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { PostsRepository } from './posts.repository';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../prisma/prisma.service';

describe(`PostsRepository`, () => {
  let postsRepository: PostsRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PostsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    postsRepository = moduleRef.get(PostsRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createPost`, () => {
    it(`should create a new post`, async () => {
      const mockedPost = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        content: `Hello world, this is a post.`,
        title: `First post.`,
        authorId: 1234,
        published: true,
      };
      prismaService.post.create.mockResolvedValue(mockedPost);

      const createPost = () =>
        postsRepository.createPost({
          data: {
            content: mockedPost.content,
            title: mockedPost.content,
            author: {
              connect: {
                id: mockedPost.authorId,
              },
            },
          },
        });

      await expect(createPost()).resolves.toBe(mockedPost);
    });
    it(`should not be over 80 characters`, async () => {
      // we don't need to mock the prismaService here because the createPost method throws an error before the prismaService is even used
      const payload = {
        content: `This is a super long tweet over 80 characters This is a super long tweet over 80 characters`,
        title: `First post too long.`,
        authorId: 1234,
        published: true,
      };

      const createPost = () =>
        postsRepository.createPost({
          data: {
            content: payload.content,
            title: payload.title,
            published: payload.published,
            author: {
              connect: {
                id: payload.authorId,
              },
            },
          },
        });

      await expect(createPost()).rejects.toBeInstanceOf(Error);
    });
  });
});
