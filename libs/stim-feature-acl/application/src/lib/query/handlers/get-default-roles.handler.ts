import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

import { AclService } from '../../service/acl.service';
import { GetDefaultRolesQuery } from '../impl/get-default-roles.query';

@QueryHandler(GetDefaultRolesQuery)
export class GetDefaultRolesHandler implements IQueryHandler<GetDefaultRolesQuery, AclRole[]> {

  constructor(private readonly service: AclService) {}

  public async execute(_query: GetDefaultRolesQuery): Promise<AclRole[]> {
    return this.service.getDefaultRoles();
  }

}
