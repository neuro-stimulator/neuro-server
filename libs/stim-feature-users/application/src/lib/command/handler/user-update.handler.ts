import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { QueryError } from '@neuro-server/stim-lib-common';
import { UserIdNotFoundException, UserWasNotUpdatedException, UserNotValidException } from '@neuro-server/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { UserWasUpdatedEvent } from '../../event/impl/user-was-updated.event';
import { UserUpdateCommand } from '../impl/user-update.command';
import { UserValidateCommand } from '../impl/user-validate.command';

@CommandHandler(UserUpdateCommand)
export class UserUpdateHandler implements ICommandHandler<UserUpdateCommand, void> {
  private readonly logger: Logger = new Logger(UserUpdateHandler.name);

  constructor(private readonly service: UsersService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: UserUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat uživatele.');
    this.logger.debug('1. Zvaliduji aktualizovaného uživatele.');
    try {
      await this.commandBus.execute(new UserValidateCommand(command.user));
      this.logger.debug('2. Budu aktualizovat validního uživatele.');
      await this.service.update(command.user);
      this.eventBus.publish(new UserWasUpdatedEvent(command.user));
    } catch (e) {
      if (e instanceof UserNotValidException) {
        throw e;
      } else if (e instanceof UserIdNotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new UserWasNotUpdatedException(command.user, (e as unknown) as QueryError);
      }
      throw new UserWasNotUpdatedException(command.user);
    }
  }
}
