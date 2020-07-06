import { IEvent } from '@nestjs/cqrs';

export class StimulatorDataEvent implements IEvent {
  constructor(public readonly buffer: Buffer) {}
}
