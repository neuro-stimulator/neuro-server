import { IEvent } from '@nestjs/cqrs';

export class FileWasUploadedEvent implements IEvent {
  constructor(public readonly path: string) {}
}
