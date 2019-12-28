import * as path from 'path';
import * as fs from 'fs';

import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { SERVER_HTTP_PORT } from 'diplomka-share';

import { AppModule } from './app.module';

const logger = new Logger('Main');

async function initDbTriggers() {
  logger.log('Inicializuji triggery...');
  const files: string[] = fs.readdirSync('triggers').filter(file => file.endsWith('trigger.sql'));
  const connection = getConnection();
  for (const file of files) {
    const content = await fs.readFileSync(`triggers/${file}`);
    logger.log(`Aplikuji trigger ze souboru: ${file}`);
    await connection.query(content.toString());
  }
}

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useStaticAssets(path.join(__dirname, 'publicc'));

  await initDbTriggers();

  await app.listen(SERVER_HTTP_PORT);
  Logger.log(`Server běží na portu: ${SERVER_HTTP_PORT}`);
}

bootstrap();
