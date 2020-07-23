import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';

export class IsAuthorizedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: Request = ctx.getRequest<Request>();

    if (req['user'] === undefined) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
