import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

import { GetAllAclRolesQuery } from '@neuro-server/stim-feature-acl/application';

@Injectable()
export class AclRolesFacade {
  private readonly logger = new Logger(AclRolesFacade.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getRoles(): Promise<AclRole[]> {
    return this.queryBus.execute(new GetAllAclRolesQuery());
  }
}
