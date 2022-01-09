import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { AclRole } from '@stechy1/diplomka-share';

import { GetDefaultRolesQuery } from '@neuro-server/stim-feature-acl/application';

import { AssignUserRoleCommand } from '../../command/impl/assign-user-role.command';
import { UserWasCreatedEvent } from '../impl/user-was-created.event';

@EventsHandler(UserWasCreatedEvent)
export class UserWasCreatedHandler implements IEventHandler<UserWasCreatedEvent> {

  private readonly logger: Logger = new Logger(UserWasCreatedHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  public async handle(event: UserWasCreatedEvent): Promise<void> {
    this.logger.debug('Butu přiřazovat novému uživateli výchozí role.');
    const defaultRoles: AclRole[] = await this.queryBus.execute(new GetDefaultRolesQuery());

    await this.commandBus.execute(new AssignUserRoleCommand(event.userID, defaultRoles));
  }

}
