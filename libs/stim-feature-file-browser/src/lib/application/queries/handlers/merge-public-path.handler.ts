import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { MergePublicPathQuery } from '../impl/merge-public-path.query';

@QueryHandler(MergePublicPathQuery)
export class MergePublicPathHandler
  implements IQueryHandler<MergePublicPathQuery, string> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: MergePublicPathQuery): Promise<string> {
    return this.service.mergePublicPath(query.path);
  }
}
