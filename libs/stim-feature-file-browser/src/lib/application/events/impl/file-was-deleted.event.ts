import { IEvent } from '@nestjs/cqrs';

export class FileWasDeletedEvent implements IEvent {
  constructor(public readonly path: string) {}
}
