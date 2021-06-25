import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';

import { User } from '@stechy1/diplomka-share';

import { LoginResponse, TokenContent } from '@diplomka-backend/stim-feature-auth/domain';

import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private readonly service: TokenService) {}

  /**
   * Přihlásí uživatele
   *
   * @param user User Uživatel
   * @param ipAddress string IP adresa uživatele
   * @param clientId ID klientské aplikace
   */
  async login(user: User, ipAddress: string, clientId: string): Promise<LoginResponse> {
    this.logger.verbose('Vytvářím JWT payload.');
    const payload: JwtPayload = {
      sub: user.uuid,
    };

    const loginResponse: LoginResponse = await this.service.createAccessToken(payload);
    const tokenContent: TokenContent = {
      userId: user.id,
      uuid: user.uuid,
      ipAddress,
      clientId,
    };

    loginResponse.refreshToken = await this.service.createRefreshToken(tokenContent);

    return loginResponse;
  }

  /**
   * Odhlásí uživatele podle refresh tokenu
   *
   * @param userUUID uuid UUID uživatele
   * @param clientID string ID klienta, ze kterého se má odstranit pro uživatele přístup
   * @param refreshToken string Refresh token
   */
  async logout(userUUID: string, clientID: string, refreshToken: string): Promise<void> {
    await this.service.deleteRefreshToken(userUUID, clientID, refreshToken);
  }

  /**
   * Odhláší uživatele ze všech zařízení
   *
   * @param userUUID uuid UUID uživatele
   */
  async logoutFromAll(userUUID: string): Promise<void> {
    await this.service.deleteRefreshTokenForUser(userUUID);
  }
}
