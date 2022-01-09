import { Controller, Get, Logger, UseGuards } from '@nestjs/common';

import { AclRole } from '@stechy1/diplomka-share';

import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AclRolesFacade } from '../service/acl-roles.facade';

@Controller('/api/acl/roles')
@UseGuards(IsAuthorizedGuard)
export class AclRolesController {
  private readonly logger = new Logger(AclRolesController.name);

  constructor(private readonly facade: AclRolesFacade) {}

  @Get('')
  public async getRoles(): Promise<AclRole[]> {
    return this.facade.getRoles();
  }
}
