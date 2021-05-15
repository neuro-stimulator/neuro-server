import { Injectable, Logger } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { JwtPayload, LoginResponse, TokenContent } from '@diplomka-backend/stim-feature-auth/domain';

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
      sub: user.id,
    };

    const loginResponse: LoginResponse = await this.service.createAccessToken(payload);
    const tokenContent: TokenContent = {
      userId: user.id,
      ipAddress,
      clientId,
    };

    loginResponse.refreshToken = await this.service.createRefreshToken(tokenContent);

    return loginResponse;
  }

  /**
   * Odhlásí uživatele podle refresh tokenu
   *
   * @param userID number ID uživatele
   * @param clientID ID klienta, ze kterého se má odstranit pro uživatele přístup
   * @param refreshToken string Refresh token
   */
  async logout(userID: number, clientID: string, refreshToken: string): Promise<void> {
    await this.service.deleteRefreshToken(userID, clientID, refreshToken);
  }

  /**
   * Odhláší uživatele ze všech zařízení
   *
   * @param userID number ID uživatele
   */
  async logoutFromAll(userID: number): Promise<void> {
    await this.service.deleteRefreshTokenForUser(userID);
  }
}
