import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { envs } from './config';
import { ValidationPipe } from '@nestjs/common';

import './auth/strategies/access-token.strategy';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Hello worldz...');

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(envs.PORT);
}
bootstrap();
