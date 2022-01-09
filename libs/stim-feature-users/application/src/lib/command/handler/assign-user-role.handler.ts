import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { UsersService } from '../../service/users.service';
import { AssignUserRoleCommand } from '../impl/assign-user-role.command';

@CommandHandler(AssignUserRoleCommand)
export class AssignUserRoleHandler implements ICommandHandler<AssignUserRoleCommand, void> {

  private readonly logger: Logger = new Logger(AssignUserRoleHandler.name);

  constructor(private readonly service: UsersService) {}

  public async execute(command: AssignUserRoleCommand): Promise<void> {
    this.logger.debug(`Přiřazuji uživateli role: ${command.roles.map(role => role.role).join(',')}.`);
    const user: User = await this.service.byId(command.userId);

    user.acl = [];
    for (const role of command.roles) {
      user.acl.push({
        role: role.role
      });
    }

    await this.service.update(user);
  }

}
