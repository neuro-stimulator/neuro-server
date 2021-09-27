import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '@diplomka-backend/stim-feature-users/domain';

export const TokenRefreshed = createParamDecorator<string, ExecutionContext>((data: string, ctx: ExecutionContext) => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest<RequestWithUser>();

  return request.tokenRefreshed;
});