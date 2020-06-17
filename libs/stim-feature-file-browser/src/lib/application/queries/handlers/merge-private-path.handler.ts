import { IQueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { MergePrivatePathQuery } from '../impl/merge-private-path.query';

export class MergePrivatePathHandler
  implements IQueryHandler<MergePrivatePathQuery, string> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: MergePrivatePathQuery): Promise<string> {
    return this.service.mergePrivatePath(query.path);
  }
}
