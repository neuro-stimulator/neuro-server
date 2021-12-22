import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclPossession } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllPossessionsQuery } from '../impl/get-all-possessions.query';

@QueryHandler(GetAllPossessionsQuery)
export class GetAllPossessionsHandler implements IQueryHandler<GetAllPossessionsQuery, AclPossession[]> {

  private readonly logger: Logger = new Logger(GetAllPossessionsHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllPossessionsQuery): Promise<AclPossession[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Possessions.');
    return this.service.getPossessions();
  }

}
