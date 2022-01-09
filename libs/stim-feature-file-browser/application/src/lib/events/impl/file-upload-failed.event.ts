import { IEvent } from '@nestjs/cqrs';

export class FileUploadFailedEvent implements IEvent {
  constructor(public readonly path: string, public readonly originalName: string) {}
}
