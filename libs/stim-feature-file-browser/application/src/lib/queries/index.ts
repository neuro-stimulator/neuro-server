import { GetContentHandler } from './handlers/get-content.handler';
import { MergePublicPathHandler } from './handlers/merge-public-path.handler';
import { MergePrivatePathHandler } from './handlers/merge-private-path.handler';
import { ReadPrivateJSONFileHandler } from './handlers/read-private-json-file.handler';
import { GetPublicPathHandler } from './handlers/get-public-path.handler';

export const QueryHandlers = [GetContentHandler, MergePublicPathHandler, MergePrivatePathHandler, ReadPrivateJSONFileHandler, GetPublicPathHandler];
