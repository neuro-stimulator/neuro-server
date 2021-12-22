import { ICommand } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share';

export class AclUpdateCommand implements ICommand {
  constructor(public readonly acl: Acl) {}
}
