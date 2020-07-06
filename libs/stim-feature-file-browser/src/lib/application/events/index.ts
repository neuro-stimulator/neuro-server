import { FolderWasCreatedHandler } from './handlers/folder-was-created.handler';
import { FileWasUploadedHandler } from './handlers/file-was-uploaded.handler';

export const EventHandlers = [FolderWasCreatedHandler, FileWasUploadedHandler];
