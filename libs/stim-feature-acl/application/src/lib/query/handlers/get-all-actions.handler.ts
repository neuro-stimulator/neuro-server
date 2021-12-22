import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclAction } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllActionsQuery } from '../impl/get-all-actions.query';

@QueryHandler(GetAllActionsQuery)
export class GetAllActionsHandler implements IQueryHandler<GetAllActionsQuery, AclAction[]> {

  private readonly logger: Logger = new Logger(GetAllActionsHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllActionsQuery): Promise<AclAction[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Actions.');
    return this.service.getActions();
  }

}
