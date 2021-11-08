import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnauthorizedException } from '@neuro-server/stim-feature-auth/domain';

import { AuthService } from '../../service/auth.service';
import { LogoutCommand } from '../impl/logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  private readonly logger: Logger = new Logger(LogoutHandler.name);

  constructor(private readonly service: AuthService) {}

  async execute(command: LogoutCommand): Promise<void> {
    this.logger.debug('Budu odhlašovat uživatele');
    if (command.fromAll) {
      await this.service.logoutFromAll(command.userUUID);
    } else {
      if (!command.refreshToken) {
        throw new UnauthorizedException();
      }
      await this.service.logout(command.userUUID, command.clientID, command.refreshToken);
    }
  }
}
