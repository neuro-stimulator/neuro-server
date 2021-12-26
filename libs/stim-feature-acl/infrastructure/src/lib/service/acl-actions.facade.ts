import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AclAction } from '@stechy1/diplomka-share';

import { GetAllAclActionsQuery } from '@neuro-server/stim-feature-acl/application';

@Injectable()
export class AclActionsFacade {
  private readonly logger = new Logger(AclActionsFacade.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getActions(): Promise<AclAction[]> {
    return this.queryBus.execute(new GetAllAclActionsQuery());
  }
}
