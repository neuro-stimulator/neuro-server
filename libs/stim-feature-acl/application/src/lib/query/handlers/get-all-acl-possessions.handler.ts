import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclPossession } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllAclPossessionsQuery } from '../impl/get-all-acl-possessions.query';

@QueryHandler(GetAllAclPossessionsQuery)
export class GetAllAclPossessionsHandler implements IQueryHandler<GetAllAclPossessionsQuery, AclPossession[]> {
  private readonly logger: Logger = new Logger(GetAllAclPossessionsHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllAclPossessionsQuery): Promise<AclPossession[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Possessions.');
    return this.service.getPossessions();
  }
}
