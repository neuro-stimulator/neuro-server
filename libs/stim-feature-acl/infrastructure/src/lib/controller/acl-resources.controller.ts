import { Controller, Get, Logger } from '@nestjs/common';

import { AclResource } from '@stechy1/diplomka-share';

import { AclFacade } from '../service/acl.facade';

@Controller('/api/acl/resources')
export class AclController {
  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}

  @Get('')
  public async getResources(): Promise<AclResource[]> {
    return this.facade.getResources();
  }
}
