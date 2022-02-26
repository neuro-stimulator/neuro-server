import { FileUploadFailedHandler } from './handlers/file-upload-failed.handler';
import { FileWasUploadedHandler } from './handlers/file-was-uploaded.handler';
import { FolderWasCreatedHandler } from './handlers/folder-was-created.handler';

export const EventHandlers = [FolderWasCreatedHandler, FileWasUploadedHandler, FileUploadFailedHandler];
