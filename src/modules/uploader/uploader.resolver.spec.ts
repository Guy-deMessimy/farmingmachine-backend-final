import { Test, TestingModule } from '@nestjs/testing';
import { UploaderResolver } from './uploader.resolver';

describe('UploaderResolver', () => {
  let resolver: UploaderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploaderResolver],
    }).compile();

    resolver = module.get<UploaderResolver>(UploaderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
