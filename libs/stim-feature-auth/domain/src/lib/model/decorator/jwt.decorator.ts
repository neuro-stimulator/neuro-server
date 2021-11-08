import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '@neuro-server/stim-feature-users/domain';

export const JWT = createParamDecorator<string, ExecutionContext>((data: string, ctx: ExecutionContext) => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest<RequestWithUser>();

  return request.cookies['SESSIONID'];
});
