import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { JwtPayload, LoginResponse, UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';
import { RequestWithUser } from '@diplomka-backend/stim-feature-users/domain';

import { TokenService } from '../service/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(private readonly service: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: RequestWithUser = ctx.getRequest<RequestWithUser>();

    const cookies = req.cookies;
    if (cookies === undefined) {
      this.logger.warn('Cookies nebyly nalezeny. Přihlášení nebude fungovat!');
      return false;
    }

    // CSRF protection
    const csrfCookie = req.cookies['XSRF-TOKEN'];
    const csrfHeader = req.headers['x-xsrf-token'] as string;
    const jwt = cookies['SESSIONID'];
    const isGET = req.method === 'GET';

    // uživatel vůbec není přihlášený, ale snaží se pouze číst data ze serveru
    if (!csrfCookie && !csrfHeader) {
      this.logger.verbose('Uživatel není přihlášený. Povoluji přístup k serveru, ale objekt \'user\' nebude existovat.');
      return true;
    }

    // uživateli vypršela session a snaží se něco modifikovat na serveru
    // -> musí se znovu přihlásit
    if (!csrfHeader && csrfCookie && !isGET) {
        this.logger.verbose('Uživateli vypršelo sezení, musí se znovu přihlásit.');
        throw new UnauthorizedException();
    }

    // CSRF protekce
    if (csrfCookie !== csrfHeader && !isGET) {
      this.logger.warn('XSRF-TOKEN hlavička nesedí!');
      this.logger.debug('XSRF-TOKEN: ' + csrfCookie);
      this.logger.debug('x-xsrf-token: ' + csrfHeader);
      throw new UnauthorizedException();
    }

    // CSRF je validní a jedná se o modifikující požadavek
    if (csrfCookie === csrfHeader && !isGET) {
      this.logger.verbose('XSRF je validní. Uživatel by mohl modifikovat data.');
      req.refreshToken = csrfCookie;
      if (!jwt) {
        this.logger.verbose('JWT není přítomný! Uživateli nejspíš vypršela session.');

        const clientId: string = req.header('x-client-id');
        const ip: string = req.ip;

        try {
          const [loginResponse, userId]: [LoginResponse, number] = await this.service.refreshJWT(req.refreshToken, clientId, ip);
          this.logger.verbose('Session byla úspěšně obnovena.');

          req.user = {};
          req.user.id = userId;
          req.refreshToken = loginResponse.refreshToken;

          req.res.cookie('SESSIONID', loginResponse.accessToken, { httpOnly: true, secure: false, expires: loginResponse.expiresIn, sameSite: 'strict' });
          req.res.cookie('XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' });

        } catch (e) {
          this.logger.error(e.message);
          this.logger.error(e.trace);
          throw new UnauthorizedException();
        }


        return true;
      }
    }

    if (isGET && !jwt) {
      return true;
    }

    let data: { id: number };

    try {
      const payload: JwtPayload = await this.service.validateToken(jwt);
      data = await this.service.validatePayload(payload);

    } catch (e) {
      this.logger.error(e.message);
      this.logger.error(e.trace);
      throw new UnauthorizedException();
    }

    if (!data) {
      this.logger.verbose('JWT obsahuje nevalidní data');
      throw new UnauthorizedException();
    }

    req.user = data;

    return true;
  }
}
