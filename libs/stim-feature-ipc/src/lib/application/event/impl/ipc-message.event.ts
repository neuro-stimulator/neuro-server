import { IEvent } from '@nestjs/cqrs';

export class IpcMessageEvent implements IEvent {
  constructor(
    public readonly message: any,
    public readonly topic: string,
    public readonly id: string
  ) {}
}
