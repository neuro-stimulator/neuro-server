import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';

import { ReadPrivateJSONFileQuery } from '../impl/read-private-json-file.query';
import { Logger } from '@nestjs/common';

@QueryHandler(ReadPrivateJSONFileQuery)
export class ReadPrivateJSONFileHandler
  implements IQueryHandler<ReadPrivateJSONFileQuery> {
  private readonly logger: Logger = new Logger(ReadPrivateJSONFileHandler.name);
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: ReadPrivateJSONFileQuery): Promise<any> {
    this.logger.debug(
      `Budu číst privátní JSON soubor na cestě: '${query.path}'.`
    );
    const path = this.service.mergePrivatePath(true, query.path);
    return JSON.parse(
      this.service.readFileBuffer(path, { encoding: 'utf-8' }) as string
    );
  }
}
