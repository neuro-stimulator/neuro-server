import { IEvent } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share';

export class AclWasDeletedEvent implements IEvent {
  constructor(public readonly acl: Acl) {}
}
