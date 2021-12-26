import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { AclPossession } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AclPossessionsFacade } from '../service/acl-possessions.facade';

@Controller('/api/acl/possessions')
@UseGuards(IsAuthorizedGuard)
export class AclPossessionsController {
  private readonly logger = new Logger(AclPossessionsController.name);

  constructor(private readonly facade: AclPossessionsFacade) {}

  @Get('')
  public async getPossessions(): Promise<AclPossession[]> {
    return this.facade.getPossessions();
  }
}
