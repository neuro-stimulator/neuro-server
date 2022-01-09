import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { Acl } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AclFacade } from '../service/acl.facade';

@Controller('/api/acl')
@UseGuards(IsAuthorizedGuard)
export class AclController {
  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}

  @Get('')
  public async getAcl(): Promise<Acl[]> {
    return this.facade.getAcl();
  }
}
