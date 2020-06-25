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
