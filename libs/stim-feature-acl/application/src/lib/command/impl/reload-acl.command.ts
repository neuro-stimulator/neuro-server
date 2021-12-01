import { ICommand } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share/lib';

export class ReloadAclCommand implements ICommand {
  constructor(public readonly acl: Acl[]) {}
}
