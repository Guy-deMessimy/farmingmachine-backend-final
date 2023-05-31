import { Module } from '@nestjs/common';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import appConfig from './config/app.config';

// Modules
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './modules/posts/posts.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PubSubModule } from './modules/pub-sub/pub-sub.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploaderModule } from './modules/uploader/uploader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
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
    UploaderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
