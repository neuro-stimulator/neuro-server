import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share/lib';

import { GetAllAclQuery } from '../impl/get-all-acl.query';
import { AclService } from '../../service/acl.service';

@QueryHandler(GetAllAclQuery)
export class GetAllAclHandler implements IQueryHandler<GetAllAclQuery, Acl[]> {

  constructor(private readonly service: AclService) {}

  async execute(_query: GetAllAclQuery): Promise<Acl[]> {
    return this.service.getAllAcl();
  }

}
