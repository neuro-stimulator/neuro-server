import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AclService } from '../../service/acl.service';
import { ReloadAclCommand } from '../impl/reload-acl.command';

@CommandHandler(ReloadAclCommand)
export class ReloadAclHandler implements ICommandHandler<ReloadAclCommand, void> {

  constructor(private readonly service: AclService) {}

  async execute(command: ReloadAclCommand): Promise<void> {
    await this.service.reloadAcl(command.acl);
  }

}
