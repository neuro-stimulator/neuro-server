import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AclPossession } from '@stechy1/diplomka-share';

import { GetAllAclPossessionsQuery } from '@neuro-server/stim-feature-acl/application';

@Injectable()
export class AclPossessionsFacade {
  private readonly logger = new Logger(AclPossessionsFacade.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getPossessions(): Promise<AclPossession[]> {
    return this.queryBus.execute(new GetAllAclPossessionsQuery());
  }
}
