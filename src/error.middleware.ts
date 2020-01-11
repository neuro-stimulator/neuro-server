import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { ResponseMessageType } from '@stechy1/diplomka-share';

@Catch(HttpException, Error)
export class ErrorMiddleware implements ExceptionFilter {

  private readonly logger: Logger = new Logger(ErrorMiddleware.name);

  catch(exception: any, host: ArgumentsHost): any {
    const res: Response = host.switchToHttp().getResponse();
    // Pokud nemá vyjímka žádné parametry, tak nemám co odesílat
    if (Object.keys(exception).length === 0) {
      // Tak to budu ignorovat
      res.send();
      return;
    }
    this.logger.error(exception);

    res.json({ data: {}, message: {
        text: `Nastala neočekávaná chyba na serveru!`,
        type: ResponseMessageType.ERROR,
      }});
  }

}
