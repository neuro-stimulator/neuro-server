import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../service/file-browser.service';
import { GetPublicPathQuery } from '../impl/get-public-path.query';

@QueryHandler(GetPublicPathQuery)
export class GetPublicPathHandler implements IQueryHandler<GetPublicPathQuery, string> {
  private readonly logger: Logger = new Logger(GetPublicPathHandler.name);

  constructor(private readonly service: FileBrowserService) {}

  async execute(query: GetPublicPathQuery): Promise<string> {
    this.logger.debug('Budu vracet cestu k veřejné složce.');
    return this.service.publicPath;
  }
}
