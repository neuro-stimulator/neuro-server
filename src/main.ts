import 'dotenv/config';

import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { SERVER_HTTP_PORT } from './config/config';
import { initDbTriggers } from './db-setup';
import { ErrorMiddleware } from './error.middleware';

const logger = new Logger('Main');

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorMiddleware());

  await initDbTriggers(logger);

  await app.listen(SERVER_HTTP_PORT);
  Logger.log(`Server běží na portu: ${SERVER_HTTP_PORT}`);
}

bootstrap().catch(reason => logger.error(reason));
