import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclAction } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllAclActionsQuery } from '../impl/get-all-acl-actions.query';

@QueryHandler(GetAllAclActionsQuery)
export class GetAllAclActionsHandler implements IQueryHandler<GetAllAclActionsQuery, AclAction[]> {
  private readonly logger: Logger = new Logger(GetAllAclActionsHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllAclActionsQuery): Promise<AclAction[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Actions.');
    return this.service.getActions();
  }
}
