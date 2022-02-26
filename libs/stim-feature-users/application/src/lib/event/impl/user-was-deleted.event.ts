import { IEvent } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

export class UserWasDeletedEvent implements IEvent {
  constructor(public readonly user: User) {}
}
