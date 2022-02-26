import { QueryFailedError } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { UserNotValidException, UserWasNotCreatedException } from '@neuro-server/stim-feature-users/domain';
import { QueryError } from '@neuro-server/stim-lib-common';

import { UserWasCreatedEvent } from '../../event/impl/user-was-created.event';
import { UsersService } from '../../service/users.service';
import { UserInsertCommand } from '../impl/user-insert.command';
import { UserValidateCommand } from '../impl/user-validate.command';

@CommandHandler(UserInsertCommand)
export class UserInsertHandler implements ICommandHandler<UserInsertCommand, number> {
  private readonly logger: Logger = new Logger(UserInsertHandler.name);

  constructor(private readonly service: UsersService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: UserInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat nového uživatele.');
    this.logger.debug('1. Zvaliduji vkládaného uživatele.');
    try {
      await this.commandBus.execute(new UserValidateCommand(command.user));
      this.logger.debug('2. Budu vkládat validního uživatele do databáze.');
      const id = await this.service.insert(command.user);
      this.eventBus.publish(new UserWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof UserNotValidException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new UserWasNotCreatedException(command.user, (e as unknown) as QueryError);
      }
      this.logger.error(e.message);
      throw new UserWasNotCreatedException(command.user);
    }
  }
}
