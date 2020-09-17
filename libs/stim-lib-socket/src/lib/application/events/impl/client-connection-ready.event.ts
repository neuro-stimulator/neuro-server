import { IEvent } from '@nestjs/cqrs';

export class ClientConnectionReadyEvent implements IEvent {
  constructor(public readonly clientID: string) {}
}
