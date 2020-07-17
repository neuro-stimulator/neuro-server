import { EventBus, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

import { User } from '@stechy1/diplomka-share';

import { QueryError } from '@diplomka-backend/stim-lib-common';
import { UserIdNotFoundException, UserWasNotDeletedException } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { UserWasDeletedEvent } from '../../event/impl/user-was-deleted.event';
import { UserDeleteCommand } from '../impl/user-delete.command';

@QueryHandler(UserDeleteCommand)
export class UserDeleteHandler implements ICommandHandler<UserDeleteCommand, void> {
  private readonly logger: Logger = new Logger(UserDeleteHandler.name);

  constructor(private readonly service: UsersService, private readonly eventBus: EventBus) {}

  async execute(command: UserDeleteCommand): Promise<void> {
    this.logger.debug('Budu mazat uživatele z databáze.');
    try {
      const user: User = await this.service.byId(command.userId);
      await this.service.delete(command.userId);
      this.eventBus.publish(new UserWasDeletedEvent(user));
    } catch (e) {
      if (e instanceof UserIdNotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new UserWasNotDeletedException(command.userId, (e as unknown) as QueryError);
      }
      throw new UserWasNotDeletedException(command.userId);
    }
  }
}
