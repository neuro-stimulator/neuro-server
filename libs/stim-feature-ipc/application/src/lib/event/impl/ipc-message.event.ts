import { IEvent } from '@nestjs/cqrs';

export class IpcMessageEvent implements IEvent {
  constructor(public readonly buffer: Buffer) {}
}
