import * as cookieParser from 'cookie-parser';

import { ValidationPipe, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EventBus } from '@nestjs/cqrs';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';
import { Logger } from '@neuro-server/stim-lib-log';
import { SocketIoAdapter } from '@neuro-server/stim-lib-socket';

import { AppModule } from './app/app.module';
import { classValidatorExceptionFactory } from './app/class-validator-exception.factory';
import { ErrorMiddleware } from './app/error.middleware';

let logger: Logger;

async function bootstrap() {
  const app: INestApplication = await NestFactory.create<INestApplication>(AppModule, { bufferLogs: true });

  const appLogger = app.get(Logger);
  logger = appLogger;
  app.useLogger(appLogger);
  app.use(cookieParser('secret'));
  app.enableCors({
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-client-id', 'x-session-state'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    origin: true,
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useGlobalFilters(new ErrorMiddleware());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: classValidatorExceptionFactory,
      groups: ['app_global_group'],
    })
  );

  const port = process.env.HTTP_PORT || process.env.PORT || 3005;
  await app.listen(port);
  appLogger.log(`Server běží na portu: ${port}.`);

  const eventBus = app.get(EventBus);
  await eventBus.publish(new ApplicationReadyEvent());
}

bootstrap().catch((reason: Error) => {
  logger?.error('Neočekávaná chyba serveru!', reason.message, reason.name);
});
