import { IEvent } from '@nestjs/cqrs';

export class IpcConnectedEvent implements IEvent {
  constructor(public readonly clientID: string) {}
}
