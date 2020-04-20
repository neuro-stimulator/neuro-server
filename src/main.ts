import 'dotenv/config';

import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, LogLevel } from '@nestjs/common';

import { AppModule } from './app.module';
import { SERVER_HTTP_PORT } from './config/config';
import { initDbTriggers } from './db-setup';
import { ErrorMiddleware } from './error.middleware';

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
  const app: NestApplication = await NestFactory.create(AppModule, {
    logger: getLoggerLevelByEnvironment()
  });

  app.useGlobalFilters(new ErrorMiddleware());

  await initDbTriggers(logger);

  await app.listen(SERVER_HTTP_PORT);
  logger.log(`Server běží na portu: ${SERVER_HTTP_PORT}.`);
}

bootstrap().catch((reason) => logger.error(reason));
