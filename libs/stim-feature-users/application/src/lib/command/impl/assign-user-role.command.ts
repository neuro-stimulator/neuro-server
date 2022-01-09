import { ICommand } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

export class AssignUserRoleCommand implements ICommand {
  constructor(public readonly userId: number, public readonly roles: AclRole[]) {}
}
