import { FolderWasCreatedEvent } from './impl/folder-was-created.event';

export const EventHandlers = [FolderWasCreatedEvent];

export * from './impl/folder-was-created.event';

export * from './impl/file-was-deleted.event';
export * from './impl/file-was-uploaded.event';
export * from './impl/folder-was-created.event';
