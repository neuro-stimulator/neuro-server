import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AclService } from '../../service/acl.service';
import { AclReloadCommand } from '../impl/acl-reload.command';

@CommandHandler(AclReloadCommand)
export class AclReloadHandler implements ICommandHandler<AclReloadCommand, void> {

  constructor(private readonly service: AclService) {}

  async execute(command: AclReloadCommand): Promise<void> {
    return this.service.reloadAcl(command.acl);
  }

}
