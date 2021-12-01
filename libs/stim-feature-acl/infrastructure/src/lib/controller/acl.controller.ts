import { Controller, Logger } from '@nestjs/common';

import { AclFacade } from '../service/acl.facade';

@Controller()
export class AclController {
  private readonly logger = new Logger(AclController.name);

  constructor(private readonly facade: AclFacade) {}
}
