import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { initDbTriggers } from './app/db-setup';
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
  app.useGlobalFilters(new ErrorMiddleware());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: classValidatorExceptionFactory,
      groups: ['app_global_group'],
    })
  );

  await initDbTriggers(logger);

  const port = environment.httpPort || 3005;
  await app.listen(port);
  logger.log(`Server běží na portu: ${port}.`);
}

bootstrap().catch((reason) => logger.error(reason));
