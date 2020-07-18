import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import { LoginResponse, TokenExpiredException, TokenRefreshFailedException } from '@diplomka-backend/stim-feature-auth/domain';

import { TokenService } from '../../service/token.service';
import { RefreshJwtCommand } from '../impl/refresh-jwt.command';

@CommandHandler(RefreshJwtCommand)
export class RefreshJwtHandler implements ICommandHandler<RefreshJwtCommand, LoginResponse> {
  private readonly logger: Logger = new Logger(RefreshJwtHandler.name);

  constructor(private readonly service: TokenService) {}

  async execute(command: RefreshJwtCommand): Promise<LoginResponse> {
    this.logger.debug('Budu obnovovat refresh token.');

    try {
      return this.service.refreshJWT(command.refreshToken, command.oldAccessToken, command.clientId, command.ipAddress);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      } else if (e instanceof NotBeforeError) {
        this.logger.error('Token ještě nebyl aktivován!');
        this.logger.error(e);
        this.logger.error(e.message);
      } else if (e instanceof JsonWebTokenError) {
        this.logger.error('Vyskytla se chyba při zpracování JWT!');
        this.logger.error(e);
        this.logger.error(e.message);
      }
      throw new TokenRefreshFailedException();
    }
  }
}
