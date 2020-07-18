import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { JwtPayload } from '@diplomka-backend/stim-feature-auth/domain';

import { TokenService } from '../service/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly service: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: Request = ctx.getRequest<Request>();

    try {
      const jwt = req.cookies['SESSIONID'];
      if (!jwt) {
        return true;
      }

      const payload: JwtPayload = await this.service.validateToken(jwt);
      const data: { id: number; refreshToken?: string } = await this.service.validatePayload(payload);
      if (!data) {
        return false;
      }

      // CSRF protection
      const csrfCookie = req.cookies['XSRF-TOKEN'];
      const csrfHeader = req.headers['x-xsrf-token'];

      if (!(csrfCookie && csrfHeader && csrfCookie === csrfHeader)) {
        return false;
      }

      data.refreshToken = csrfCookie;
      req['user'] = data;
      return true;
    } catch (e) {
      return false;
    }
  }
}
