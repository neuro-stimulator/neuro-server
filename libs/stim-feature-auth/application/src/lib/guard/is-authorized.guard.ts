import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class IsAuthorizedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const req: Request = ctx.getRequest<Request>();

    return req['user'] !== undefined;
  }
}
