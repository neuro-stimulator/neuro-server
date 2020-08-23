import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user || { id: -1 };

  return data ? user && user[data] : user;
});
