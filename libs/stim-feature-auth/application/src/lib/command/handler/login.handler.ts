import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { LoginFailedException, LoginResponse } from '@neuro-server/stim-feature-auth/domain';
import { UserByEmailPasswordQuery } from '@neuro-server/stim-feature-users/application';
import { UserNotFoundException } from '@neuro-server/stim-feature-users/domain';

import { AuthService } from '../../service/auth.service';
import { LoginCommand } from '../impl/login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResponse> {
  private readonly logger: Logger = new Logger(LoginHandler.name);

  constructor(private readonly service: AuthService, private readonly queryBus: QueryBus) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    this.logger.debug('Budu přihlašovat uživatele.');

    try {
      this.logger.debug('1. Získám uživatele na základě emailu a hesla');
      const user: User = await this.queryBus.execute(new UserByEmailPasswordQuery(command.user.email, command.user.password));

      return this.service.login(user, command.ipAddress, command.clientId);
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new LoginFailedException(e.errorCode);
      }
      this.logger.error(e.message);
      throw new LoginFailedException();
    }
  }
}
