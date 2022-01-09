import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAllAclRolesQuery } from '../impl/get-all-acl-roles.query';

@QueryHandler(GetAllAclRolesQuery)
export class GetAllAclRolesHandler implements IQueryHandler<GetAllAclRolesQuery, AclRole[]> {
  private readonly logger: Logger = new Logger(GetAllAclRolesHandler.name);

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetAllAclRolesQuery): Promise<AclRole[]> {
    this.logger.debug('Budu vyhledávat všechny ACL Roles.');
    return this.service.getRoles();
  }
}
