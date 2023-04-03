import { Module } from '@nestjs/common';
import { join } from 'path';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSubModule } from './modules/pub-sub/pub-sub.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],

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
