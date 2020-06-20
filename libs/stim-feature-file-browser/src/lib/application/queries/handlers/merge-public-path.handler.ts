import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { MergePublicPathQuery } from '../impl/merge-public-path.query';
import { Logger } from '@nestjs/common';

@QueryHandler(MergePublicPathQuery)
export class MergePublicPathHandler
  implements IQueryHandler<MergePublicPathQuery, string> {
  private readonly logger: Logger = new Logger(MergePublicPathHandler.name);
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: MergePublicPathQuery): Promise<string> {
    this.logger.debug(`Budu tvořit veřejnou cestu k: '${query.path}'.`);
    return this.service.mergePublicPath(query.exceptionIfNotFound, query.path);
  }
}
