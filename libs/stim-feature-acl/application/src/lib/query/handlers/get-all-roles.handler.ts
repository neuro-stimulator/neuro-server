import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllRolesQuery } from '../impl/get-all-roles.query';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesHandler implements IQueryHandler<GetAllRolesQuery, AclRole[]> {

  private readonly logger: Logger = new Logger(GetAllRolesHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllRolesQuery): Promise<AclRole[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Roles.');
    return this.service.getRoles();
  }

}
