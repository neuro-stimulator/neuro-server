import { IEvent } from '@nestjs/cqrs';

export class FirmwareUpdatedEvent implements IEvent {
  constructor(public readonly path: string) {}
}
