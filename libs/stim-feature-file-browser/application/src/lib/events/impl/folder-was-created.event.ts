import { IEvent } from '@nestjs/cqrs';

export class FolderWasCreatedEvent implements IEvent {
  constructor(public readonly path: string) {}
}
