import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { AclAction } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AclActionsFacade } from '../service/acl-actions.facade';

@Controller('/api/acl/actions')
@UseGuards(IsAuthorizedGuard)
export class AclActionsController {
  private readonly logger = new Logger(AclActionsController.name);

  constructor(private readonly facade: AclActionsFacade) {}

  @Get('')
  public async getActions(): Promise<AclAction[]> {
    return this.facade.getActions();
  }
}
