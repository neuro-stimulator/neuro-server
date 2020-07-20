import { CreateNewFolderHandler } from './handlers/create-new-folder.handler';
import { UploadFilesHandler } from './handlers/upload-files.handler';
import { DeleteFileHandler } from './handlers/delete-file.handler';
import { WritePrivateJsonFileHandler } from './handlers/write-private-json-file.handler';

export const FileBrowserCommands = [CreateNewFolderHandler, UploadFilesHandler, DeleteFileHandler, WritePrivateJsonFileHandler];
