import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { UserByEmailPasswordQuery } from '@diplomka-backend/stim-feature-users/application';
import { LoginFailedException, LoginResponse } from '@diplomka-backend/stim-feature-auth/domain';

import { AuthService } from '../../service/auth.service';
import { LoginCommand } from '../impl/login.command';
import { UserNotFoundException } from '@diplomka-backend/stim-feature-users/domain';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResponse> {
  private readonly logger: Logger = new Logger(LoginHandler.name);

  constructor(private readonly service: AuthService, private readonly queryBus: QueryBus) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    this.logger.debug('Budu přihlašovat uživatele.');

    try {
      this.logger.debug('1. Získám uživatele na základě emailu a hesla');
      const user: User = await this.queryBus.execute(new UserByEmailPasswordQuery(command.user.email, command.user.password));

      const loginResponse = await this.service.login(user, command.ipAddress, command.clientId);
      loginResponse.user = user;
      return loginResponse;
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw new LoginFailedException(e.errorCode);
      }
      this.logger.error(e.message);
      throw new LoginFailedException();
    }
  }
}
