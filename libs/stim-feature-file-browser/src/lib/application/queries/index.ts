import { GetContentHandler } from './handlers/get-content.handler';
import { MergePublicPathHandler } from './handlers/merge-public-path.handler';
import { MergePrivatePathHandler } from './handlers/merge-private-path.handler';
import { ReadPrivateJSONFileHandler } from './handlers/read-private-file.handler';

export const FileBrowserQueries = [
  GetContentHandler,
  MergePublicPathHandler,
  MergePrivatePathHandler,
  ReadPrivateJSONFileHandler,
];
