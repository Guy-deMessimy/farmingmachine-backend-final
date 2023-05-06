import { Module } from '@nestjs/common';
import { join } from 'path';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSubModule } from './modules/pub-sub/pub-sub.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { CategoriesModule } from './modules/categories/categories.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
