import { IEvent } from '@nestjs/cqrs';

export class IpcErrorEvent implements IEvent {
  constructor(public readonly error: any) {}
}
