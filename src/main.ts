import * as path from 'path';

import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { SERVER_HTTP_PORT } from './config/config';
import { initDbTriggers } from './db-setup';

const logger = new Logger('Main');

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useStaticAssets(path.join(__dirname, 'publicc'));

  await initDbTriggers(logger);

  await app.listen(SERVER_HTTP_PORT);
  Logger.log(`Server běží na portu: ${SERVER_HTTP_PORT}`);
}

bootstrap();
