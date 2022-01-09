import { FolderWasCreatedHandler } from './handlers/folder-was-created.handler';
import { FileWasUploadedHandler } from './handlers/file-was-uploaded.handler';
import { FileUploadFailedHandler } from './handlers/file-upload-failed.handler';

export const EventHandlers = [FolderWasCreatedHandler, FileWasUploadedHandler, FileUploadFailedHandler];
