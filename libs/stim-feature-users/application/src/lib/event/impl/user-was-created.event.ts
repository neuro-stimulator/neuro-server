import { IEvent } from '@nestjs/cqrs';

export class UserWasCreatedEvent implements IEvent {
  constructor(public readonly userID: number) {}
}
