import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { transformAndValidate } from 'class-transformer-validator';

import { transformValidationErrors } from '@neuro-server/stim-lib-common';
import { UserDTO, UserNotValidException } from '@neuro-server/stim-feature-users/domain';

import { UserValidateCommand } from '../impl/user-validate.command';

@CommandHandler(UserValidateCommand)
export class UserValidateHandler implements ICommandHandler<UserValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(UserValidateHandler.name);

  async execute(command: UserValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat uživatele...');
    // Zvaliduji sekvencí
    try {
      await transformAndValidate(UserDTO, command.user, { validator: { groups: command.validationGroups } });
      this.logger.debug('Validace byla úspěšná.');
      return true;
    } catch (e) {
      throw new UserNotValidException(command.user, transformValidationErrors(e));
    }
  }
}
