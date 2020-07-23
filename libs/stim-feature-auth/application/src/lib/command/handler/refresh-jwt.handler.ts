import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';

import { LoginResponse, TokenExpiredException, TokenNotFoundException, TokenRefreshFailedException } from '@diplomka-backend/stim-feature-auth/domain';

import { TokenService } from '../../service/token.service';
import { RefreshJwtCommand } from '../impl/refresh-jwt.command';
import { UserByIdQuery } from '@diplomka-backend/stim-feature-users/application';

@CommandHandler(RefreshJwtCommand)
export class RefreshJwtHandler implements ICommandHandler<RefreshJwtCommand, LoginResponse> {
  private readonly logger: Logger = new Logger(RefreshJwtHandler.name);

  constructor(private readonly service: TokenService, private readonly queryBus: QueryBus) {}

  async execute(command: RefreshJwtCommand): Promise<LoginResponse> {
    this.logger.debug('Budu obnovovat refresh token.');

    try {
      const [loginResponse, userId]: [LoginResponse, number] = await this.service.refreshJWT(command.refreshToken, command.oldAccessToken, command.clientId, command.ipAddress);
      this.logger.debug('Získám informace o uživateli.');
      loginResponse.user = await this.queryBus.execute(new UserByIdQuery(userId));

      return loginResponse;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      } else if (e instanceof TokenNotFoundException) {
        this.logger.error('Token nebyl nalezen!');
        this.logger.error(e);
        this.logger.error(e.message);
      } else if (e instanceof NotBeforeError) {
        this.logger.error('Token ještě nebyl aktivován!');
        this.logger.error(e);
        this.logger.error(e.message);
      } else if (e instanceof JsonWebTokenError) {
        this.logger.error('Vyskytla se chyba při zpracování JWT!');
        this.logger.error(e);
        this.logger.error(e.message);
      } else {
        this.logger.error('Vyskytla se neznámá chyba při zpracování JWT!');
        this.logger.error(e);
        this.logger.error(e.message);
      }
      throw new TokenRefreshFailedException();
    }
  }
}
