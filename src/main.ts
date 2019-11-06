import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { getConnection } from 'typeorm';
import * as fs from 'fs';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useStaticAssets(join(__dirname, 'publicc'));

  const content = await fs.readFileSync('triggers.sql');
  const connection = getConnection();
  await connection.query(content.toString());

  await app.listen(3000);
  Logger.log('Server běží na portu: 3000');
}
bootstrap();
