import { LoggerService } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

export class Logger implements LoggerService {
  private context?: string;

  constructor(private readonly winston: WinstonLogger) {}

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string): WinstonLogger {
    context = context || this.context;

    if('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.winston.info(msg as string, { context, ...meta });
    }

    return this.winston.info(message, { context });
  }

  public error(message: any, trace?: string, context?: string): WinstonLogger {
    context = context || this.context;

    if(message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.winston.error(msg, { context, stack: [trace || message.stack], ...meta });
    }

    if('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.winston.error(msg as string, { context, stack: [trace], ...meta });
    }

    return this.winston.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string): WinstonLogger {
    context = context || this.context;

    if('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.winston.warn(msg as string, { context, ...meta });
    }

    return this.winston.warn(message, { context });
  }

  public debug?(message: any, context?: string): WinstonLogger {
    context = context || this.context;

    if('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.winston.debug(msg as string, { context, ...meta });
    }

    return this.winston.debug(message, { context });
  }

  public verbose?(message: any, context?: string): WinstonLogger {
    context = context || this.context;

    if('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.winston.verbose(msg as string, { context, ...meta });
    }

    return this.winston.verbose(message, { context });
  }

}
