import { CreateNewFolderHandler } from './handlers/create-new-folder.handler';
import { UploadFilesHandler } from './handlers/upload-files.handler';
import { DeleteFileHandler } from './handlers/delete-file.handler';
import { WritePrivateJSONFilaHandler } from './handlers/write-private-json-fila.handler';

export const FileBrowserCommands = [
  CreateNewFolderHandler,
  UploadFilesHandler,
  DeleteFileHandler,
  WritePrivateJSONFilaHandler,
];

export * from './impl/create-new-folder.command';
export * from './impl/upload-files.command';
export * from './impl/delete-file.command';
export * from './impl/write-private-json-file.command';
