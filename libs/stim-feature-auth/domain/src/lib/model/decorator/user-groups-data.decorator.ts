import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User, UserGroupInfo } from '@stechy1/diplomka-share';

import { RequestWithUser } from '@neuro-server/stim-feature-users/domain';

export const UserGroupsData = createParamDecorator<string, ExecutionContext>((data: string, ctx: ExecutionContext) => {
  const request: RequestWithUser = ctx.switchToHttp().getRequest<RequestWithUser>();
  const user: User = request.user || { userGroups: {} };

  return Object.values(user.userGroups).map((userGroup: UserGroupInfo) => userGroup.id);
});
