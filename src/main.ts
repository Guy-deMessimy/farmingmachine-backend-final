import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // have error message in case of incorrect request
      disableErrorMessages: false,
      // filter out properties that should not be received by the method handler and removed it
      whitelist: true,
      //  stop a request if any non-white listed properties are present
      forbidNonWhitelisted: false,
      // transform payloads on an instance of their dto
      transform: true,
      // perform conversion of primitive types comes from the network (ex request id = string to number)
      // if true @type on DTO can be disable
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
