import { Acl } from '@stechy1/diplomka-share/lib';

import { ICommand } from '@nestjs/cqrs';

export class AclReloadCommand implements ICommand {
  constructor(public readonly acl: Acl[]) {}
}
