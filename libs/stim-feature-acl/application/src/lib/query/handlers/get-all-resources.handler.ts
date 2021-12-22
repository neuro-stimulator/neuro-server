import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclResource } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllResourcesQuery } from '../impl/get-all-resources.query';

@QueryHandler(GetAllResourcesQuery)
export class GetAllResourcesHandler implements IQueryHandler<GetAllResourcesQuery, AclResource[]> {

  private readonly logger: Logger = new Logger(GetAllResourcesHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllResourcesQuery): Promise<AclResource[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Resources.');
    return this.service.getResources();
  }

}
