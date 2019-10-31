import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.useStaticAssets(join(__dirname, 'public'));

  await app.listen(3000);
  Logger.log('Server běží na portu: 3000');
}
bootstrap();
