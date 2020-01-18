import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { ResponseMessageType } from '@stechy1/diplomka-share';

/**
 * Pomocná middleware k zachycení jakékoliv chyby, která nastane na serveru
 * Pokud bych náhodou nějakou chybu neodchytíl v kontroleru,
 * odešle se na server generická informace se zprávou, že nastala
 * neočekávaná chyba na serveru
 */
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
    // Zaloguji chybu
    this.logger.error(exception);

    if (exception.response && exception.response.message) {
      res.json({message: { ...exception.response.message }});
      return;
    }

    // Odešlu klientovi informaci, že nastala neočekávaná chyba na serveru
    res.json({ data: {}, message: {
        text: `Nastala neočekávaná chyba na serveru!`,
        type: ResponseMessageType.ERROR,
      }});
  }

}
