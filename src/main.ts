import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Setting up Swagger document
  const options = new DocumentBuilder()
    .setTitle('FarmingMachine')
    .setDescription('farming application')
    .setVersion('1.0')
    .build();

  // initialize prisma service
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
