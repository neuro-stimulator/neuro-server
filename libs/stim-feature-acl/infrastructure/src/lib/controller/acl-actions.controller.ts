import { Controller, Get, Logger } from '@nestjs/common';

import { AclAction } from '@stechy1/diplomka-share';

import { AclFacade } from '../service/acl.facade';

@Controller('/api/acl/actions')
export class AclController {
  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}

  @Get('')
  public async getActions(): Promise<AclAction[]> {
    return this.facade.getActions();
  }

}
