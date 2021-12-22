import { IEvent } from '@nestjs/cqrs';

export class AclWasCreatedEvent implements IEvent {
  constructor(public readonly aclID: number) {}
}
