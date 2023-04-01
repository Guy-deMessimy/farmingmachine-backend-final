import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { ApiModule } from 'src/api/api.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ApiModule,
    PostsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
