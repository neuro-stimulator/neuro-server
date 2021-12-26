import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { AclResource } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AclResourcesFacade } from '../service/acl-resources.facade';

@Controller('/api/acl/resources')
@UseGuards(IsAuthorizedGuard)
export class AclResourcesController {
  private readonly logger = new Logger(AclResourcesController.name);

  constructor(private readonly facade: AclResourcesFacade) {}

  @Get('')
  public async getResources(): Promise<AclResource[]> {
    return this.facade.getResources();
  }
}
