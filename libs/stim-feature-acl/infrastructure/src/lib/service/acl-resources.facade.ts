import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AclResource } from '@stechy1/diplomka-share';

import { GetAllAclResourcesQuery } from '@neuro-server/stim-feature-acl/application';

@Injectable()
export class AclResourcesFacade {
  private readonly logger = new Logger(AclResourcesFacade.name);

  constructor(private readonly queryBus: QueryBus) {}

  public async getResources(): Promise<AclResource[]> {
    return this.queryBus.execute(new GetAllAclResourcesQuery());
  }
}
