import { Response } from 'express';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { MessageCodes } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { UnauthorizedException } from '@neuro-server/stim-feature-auth/domain';
import { PermissionDeniedException } from '@neuro-server/stim-feature-acl/domain';

/**
 * Pomocná middleware k zachycení jakékoliv chyby, která nastane na serveru
 * Pokud bych náhodou nějakou chybu neodchytíl v kontroleru,
 * odešle se na server generická informace se zprávou, že nastala
 * neočekávaná chyba na serveru
 */
@Catch(ControllerException, HttpException, Error)
export class ErrorMiddleware implements ExceptionFilter {
  private readonly logger: Logger = new Logger(ErrorMiddleware.name);

  private _sendErrorResponse(res: Response, exception, status = HttpStatus.BAD_REQUEST) {
    res.status(status);
    res.json({ message: { code: exception.errorCode, params: exception.params } });
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const res: Response = host.switchToHttp().getResponse();
    // Pokud nemá vyjímka žádné parametry, tak nemám co odesílat
    if (Object.keys(exception).length === 0) {
      // Tak to budu ignorovat
      res.send();
      return;
    }
    // Zaloguji chybu
    this.logger.error(exception);

    if (exception instanceof UnauthorizedException) {
      this.logger.error('Neautorizovaný přístup. Mažu všechna cookie z requestu.');
      res.clearCookie('SESSIONID');
      res.clearCookie('XSRF-TOKEN');
      this._sendErrorResponse(res, exception, HttpStatus.UNAUTHORIZED);
      return;
    }
    if (exception instanceof PermissionDeniedException) {
      this.logger.error('Nedostatečná oprávnění k vykonání akce.');
      this._sendErrorResponse(res, exception, HttpStatus.FORBIDDEN)
      return;
    }
    if (exception instanceof ControllerException) {
      this._sendErrorResponse(res, exception);
      return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    // Odešlu klientovi informaci, že nastala neočekávaná chyba na serveru
    res.json({ message: { code: MessageCodes.CODE_ERROR } });
  }
}
