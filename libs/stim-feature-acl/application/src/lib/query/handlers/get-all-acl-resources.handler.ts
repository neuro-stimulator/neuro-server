import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclResource } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllAclResourcesQuery } from '../impl/get-all-acl-resources.query';

@QueryHandler(GetAllAclResourcesQuery)
export class GetAllAclResourcesHandler implements IQueryHandler<GetAllAclResourcesQuery, AclResource[]> {
  private readonly logger: Logger = new Logger(GetAllAclResourcesHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllAclResourcesQuery): Promise<AclResource[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Resources.');
    return this.service.getResources();
  }
}
