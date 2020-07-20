import { IEvent } from '@nestjs/cqrs';

export class ClientDisconnectedEvent implements IEvent {
  constructor(public readonly clientID: string) {}
}
