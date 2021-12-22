import { Controller, Get, Logger } from '@nestjs/common';

import { Acl } from '@stechy1/diplomka-share';

import { AclFacade } from '../service/acl.facade';

@Controller('/api/acl')
export class AclController {

  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}

  @Get('')
  public async getAcl(): Promise<Acl[]> {
    return [];
  }
}
