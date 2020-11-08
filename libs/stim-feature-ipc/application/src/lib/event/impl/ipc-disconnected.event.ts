import { IEvent } from '@nestjs/cqrs';

export class IpcDisconnectedEvent implements IEvent {
  constructor(public readonly clientID: string) {}
}
