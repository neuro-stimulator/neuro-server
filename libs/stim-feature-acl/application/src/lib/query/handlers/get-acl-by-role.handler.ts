import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetAclByRoleQuery } from '../impl/get-acl-by-role.query';

@QueryHandler(GetAclByRoleQuery)
export class GetAclByRoleHandler implements IQueryHandler<GetAclByRoleQuery, Acl[]> {

  private readonly logger: Logger = new Logger(GetAclByRoleHandler.name);

  constructor(private readonly service: AclService) {}

  async execute(query: GetAclByRoleQuery): Promise<Acl[]> {
    this.logger.debug(`Budu vyhledávat všechny acl podle zadaných rolí: ${query.roleIds?.join(',')}.`)
    return this.service.aclByRoles(query.roleIds);
  }

}
