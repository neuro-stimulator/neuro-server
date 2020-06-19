import { IEvent } from '@nestjs/cqrs';

export class SerialOpenEvent implements IEvent {
  constructor(public readonly path: string) {}
}
