import { IEvent } from '@nestjs/cqrs';

export class ClientConnectedEvent implements IEvent {
  constructor(public readonly clientID: string) {}
}
