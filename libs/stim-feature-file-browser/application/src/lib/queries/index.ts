import { GetContentHandler } from './handlers/get-content.handler';
import { GetPublicPathHandler } from './handlers/get-public-path.handler';
import { MergePrivatePathHandler } from './handlers/merge-private-path.handler';
import { MergePublicPathHandler } from './handlers/merge-public-path.handler';
import { ReadPrivateJSONFileHandler } from './handlers/read-private-json-file.handler';

export const QueryHandlers = [GetContentHandler, MergePublicPathHandler, MergePrivatePathHandler, ReadPrivateJSONFileHandler, GetPublicPathHandler];
