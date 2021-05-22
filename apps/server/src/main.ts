import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import * as cookieParser from 'cookie-parser';

import { ApplicationReadyEvent } from '@diplomka-backend/stim-lib-common';
import { InitializeTriggersCommand } from '@diplomka-backend/stim-feature-triggers/application';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ErrorMiddleware } from './app/error.middleware';
import { classValidatorExceptionFactory } from './app/class-validator-exception.factory';

const logger = new Logger('Main');

/**
 * Nastaví úroveň logování podle typu prostředí
 *
 * PRODUCTION = 'log', 'error'
 * TESTING = 'log', 'error', 'warn'
 * DEVELOPMENT = 'log', 'error', 'warn', 'debug', 'verbose'
 */
function getLoggerLevelByEnvironment(): LogLevel[] {
  const levels: LogLevel[] = ['log', 'error'];
  if (process.env.PRODUCTION === 'true') {
    return levels;
  }

  levels.push('warn');
  if (process.env.TESTING === 'true' || process.env.NODE_ENV === 'test') {
    return levels;
  }

  levels.push('debug', 'verbose');

  return levels;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLoggerLevelByEnvironment(),
  });

  app.use(cookieParser('secret'));
  app.enableCors({
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-client-id', 'x-session-state'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    origin: true,
  });

  app.useGlobalFilters(new ErrorMiddleware());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: classValidatorExceptionFactory,
      groups: ['app_global_group'],
    })
  );

  logger.log(environment);

  const port = environment.httpPort || 3005;
  await app.listen(port);
  logger.log(`Server běží na portu: ${port}.`);

  const commandBus = app.get(CommandBus);
  await commandBus.execute(new InitializeTriggersCommand());
  const eventBus = app.get(EventBus);
  await eventBus.publish(new ApplicationReadyEvent());
}

bootstrap().catch((reason: Error) => {
  logger.error(reason.message);
  logger.error(reason.stack);
});
