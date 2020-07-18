import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { UserNotValidException, UserWasNotCreatedException, UserWasNotRegistredException } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { RegisterUserCommand } from '../impl/register-user.command';
import { UserInsertCommand } from '../impl/user-insert.command';
import { UserValidateCommand } from '../impl/user-validate.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, number> {
  private readonly logger: Logger = new Logger(RegisterUserHandler.name);

  constructor(private readonly service: UsersService, private readonly commandBus: CommandBus) {}

  async execute(command: RegisterUserCommand): Promise<number> {
    this.logger.debug('Budu registrovat nového uživatele.');
    const user: User = { ...command.user };

    try {
      await this.commandBus.execute(new UserValidateCommand(command.user));
      user.password = await this.service.hashPassword(user.password);
      user.createdAt = user.updatedAt = Date.now();
      return await this.commandBus.execute(new UserInsertCommand(user));
    } catch (e) {
      if (e instanceof UserWasNotCreatedException) {
        throw new UserWasNotRegistredException(e.user, e.error);
      } else if (e instanceof UserNotValidException) {
        throw e;
      } else {
        this.logger.error(e.message);
        throw new UserWasNotRegistredException(user);
      }
    }
  }
}
