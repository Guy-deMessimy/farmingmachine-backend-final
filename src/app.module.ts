import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSubModule } from './modules/pub-sub/pub-sub.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    PostsModule,
    PrismaModule,
    PubSubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
