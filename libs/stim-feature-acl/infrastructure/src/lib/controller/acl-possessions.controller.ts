import { Controller, Get, Logger } from '@nestjs/common';

import { AclPossession } from '@stechy1/diplomka-share';

import { AclFacade } from '../service/acl.facade';

@Controller('/api/acl/possessions')
export class AclController {
  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}

  @Get('')
  public async getPossessions(): Promise<AclPossession[]> {
    return this.facade.getPossessions();
  }
}
