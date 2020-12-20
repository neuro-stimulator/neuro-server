import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { JwtPayload, UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';

import { TokenService } from '../service/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(private readonly service: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: Request = ctx.getRequest<Request>();

    try {
      const cookies = req.cookies;
      if (cookies === undefined) {
        this.logger.warn('Cookies nebyly nalezeny. Přihlášení nebude fungovat!');
        return false;
      }

      const jwt = cookies['SESSIONID'];
      if (!jwt) {
        this.logger.verbose('JWT není přítomný');
        return true;
      }

      const payload: JwtPayload = await this.service.validateToken(jwt);
      const data: { id: number; refreshToken?: string } = await this.service.validatePayload(payload);
      if (!data) {
        this.logger.verbose('JWT obsahuje nevalidní data');
        return false;
      }

      req['user'] = data;
    } catch (e) {
      this.logger.error(e.message);
      this.logger.error(e.trace);
      throw new UnauthorizedException();
    }

    if (req.method === 'GET') {
      return true;
    }

    // CSRF protection
    const csrfCookie = req.cookies['XSRF-TOKEN'];
    const csrfHeader = req.headers['x-xsrf-token'];

    if (!(csrfCookie && csrfHeader && csrfCookie === csrfHeader)) {
      this.logger.verbose('XSRF-TOKEN hlavička nesedí, nebo není přitomna');
      console.log('XSRF-TOKEN: ' + csrfCookie);
      console.log('x-xsrf-token: ' + csrfHeader);
      throw new UnauthorizedException();
    }
    req['user'].refreshToken = csrfCookie;

    return true;
  }
}
