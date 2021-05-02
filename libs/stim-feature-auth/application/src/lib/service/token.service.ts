import { Inject, Injectable, Logger } from '@nestjs/common';

import { sign, SignOptions, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { addMinutes, getTime } from 'date-fns'

import {
  ACCESS_TOKEN_TTL,
  LoginResponse,
  JWT_KEY,
  JwtPayload,
  TokenContent,
  RefreshTokenRepository,
  RefreshTokenEntity,
  REFRESH_TOKEN_LENGTH,
  TokenNotFoundException,
  TokenExpiredException, REFRESH_TOKEN_TTL
} from '@diplomka-backend/stim-feature-auth/domain';
import { getUnixTime } from 'date-fns';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);

  private readonly usersExpired: number[] = [];

  constructor(
    @Inject(JWT_KEY) private readonly jwtKey: string,
    @Inject(ACCESS_TOKEN_TTL) private readonly accessTokenTTL: number,
    @Inject(REFRESH_TOKEN_TTL) private readonly refreshTokenTTL: number,
    @Inject(REFRESH_TOKEN_LENGTH) private readonly refreshTokenLength: number,
    private readonly repository: RefreshTokenRepository
  ) {
  }

  /**
   * Kontrola, zdali je uživatelův token expirovaný
   *
   * @param userID ID uživatele
   * @param expire Doba platnosti
   */
  private async isBlackListed(userID: number, expire: number): Promise<boolean> {
    if (this.usersExpired[userID]) {
      this.logger.verbose('Uživateli vypršelo sezení - záznam byl nalezen v cache.');
      return this.usersExpired[userID] && expire < this.usersExpired[userID];
    }

    // const entity: RefreshTokenEntity = await this.repository.one({ value: refreshTOken });
    // const invalid = (!entity || entity.expiresAt < new Date().getTime())
    // if (invalid) {
    //   this.logger.verbose('Uživateli vypršelo sezení - databází byl nalezen příliš starý refresh token.')
    // }
    //
    // return invalid;
    return false;
  }

  /**
   * Znehodnotí zadaný
   *
   * @param userID
   */
  private async revokeTokenForUser(userID: number): Promise<any> {
    this.logger.verbose(`Zneplatňuji refresh token pro uživatele: ${userID}.`);
    this.usersExpired[userID] = new Date().getDate()
  }

  /**
   * Vygeneruje a podepíše přístupový token
   *
   * @param payload JwtPayload
   */
  public async createAccessToken(payload: JwtPayload): Promise<LoginResponse> {
    this.logger.verbose('Generuji nový JWT.');
    // If expires is negative it means that token should not expire
    const options: SignOptions = {
      expiresIn: this.accessTokenTTL * 60
    };
    // Podepíšu payload
    const signedPayload = sign(payload, this.jwtKey, options);

    const response: LoginResponse = {
      accessToken: signedPayload,
      expiresIn: addMinutes(new Date(), this.accessTokenTTL)
    };

    this.logger.verbose(response);

    return response;
  }

  /**
   * Vygeneruje nový refresh token a vloží ho do databáze
   *
   * @param tokenContent TokenContent
   */
  public async createRefreshToken(tokenContent: TokenContent): Promise<string> {
    this.logger.verbose('Generuji nový refresh token.');
    const token: RefreshTokenEntity = new RefreshTokenEntity();
    const refreshToken = randomBytes(this.refreshTokenLength).toString('hex');

    token.userId = tokenContent.userId;
    token.value = refreshToken;
    token.ipAddress = tokenContent.ipAddress;
    token.clientId = tokenContent.clientId;
    token.expiresAt = getTime(addMinutes(new Date(), this.refreshTokenTTL));

    await this.repository.insert(token);

    return refreshToken;
  }

  /**
   * Ověří validitu zadaného JWT
   *
   * @param jwt string JWT
   * @param ignoreExpiration boolean True, pokud se má ignorovat expirační doba tokenu
   * @throws JsonWebTokenError Pokud nastane problém s tokenem
   * @throws TokenExpiredError Pokud má token prošlou expirační dobu, která není ignorována
   * @throws NotBeforeError Pokud token ještě nebyl aktivován
   */
  public async validateToken(jwt: string, ignoreExpiration = false): Promise<JwtPayload> {
    this.logger.verbose('Validuji zadaný JWT.');
    return verify(jwt, this.jwtKey, { ignoreExpiration }) as JwtPayload;
  }

  /**
   * Ověří, že payload je stále validní za pomoci expirační doby a případně blacklistu.
   *
   * @param payload JwtPayload
   */
  public async validatePayload(payload: JwtPayload): Promise<{ id: number }> {
    this.logger.verbose('Validuji payload.');
    if (payload.exp < getUnixTime(new Date())) {
      this.logger.verbose('Payload expiroval!');
      return null;
    }

    const tokenBlacklisted = await this.isBlackListed(payload.sub, payload.exp);
    if (!tokenBlacklisted) {
      return {
        id: payload.sub,
      };
    } else {
      return null;
    }
  }

  /**
   * Vytvoří nový JWT ze stávajícího s prodlouženou dobou expirace
   *
   * @param refreshToken string Aktuální refresh token
   * @param clientId string Id klientské aplikace
   * @param ipAddress Ip adresa klienta
   * @throws TokenNotFoundException Pokud refresh token nebyl nalezen v databázi
   * @throws TokenExpiredException Pokud je token za svojí dobou expirace
   * @throws JsonWebTokenError Pokud nastane problém s tokenem
   * @throws NotBeforeError Pokud token ještě nebyl aktivován
   */
  public async refreshJWT(refreshToken: string, clientId: string, ipAddress: string): Promise<[LoginResponse, number]> {
    this.logger.verbose('Obnovuji zadaný JWT.');
    const token: RefreshTokenEntity = await this.repository.one({ value: refreshToken });
    if (!token) {
      throw new TokenNotFoundException(refreshToken);
    }

    const payload: JwtPayload = {
      sub: token.userId,
    };
    // Vytvořím nový JWT
    const accessToken: LoginResponse = await this.createAccessToken(payload);
    // Z databáze odstraním starý refresh token
    await this.repository.delete({ id: token.id });
    // Vytvořím si nový obsah tokenu
    const tokenContent: TokenContent = {
      userId: token.userId,
      clientId,
      ipAddress,
    }
    // Vytvořím nový refresh token
    accessToken.refreshToken = await this.createRefreshToken(tokenContent);

    return [accessToken, payload.sub];
  }

  /**
   * Vymeže jeden refresh token pro zadaného uživatele
   *
   * @param userId number Id uživatele
   * @param refreshToken string Refresh token
   */
  public async deleteRefreshToken(userId: number, refreshToken: string): Promise<void> {
    this.logger.verbose(`Mažu jeden refresh token pro uživatele: ${userId}.`);
    // Vymažu jeden token z databáze
    await this.repository.delete({ value: refreshToken });
    // Zneplatním token v lokální paměti
    await this.revokeTokenForUser(userId);
  }

  /**
   * Vymeže všechny refresh tokeny pro zadaného uživatele
   *
   * @param userId number Id uživatele
   */
  public async deleteRefreshTokenForUser(userId: number): Promise<void> {
    this.logger.verbose(`Mažu všechny refresh tokeny pro uživatele: ${userId}.`);
    // Vymažu všechy tokeny pro zadaného uživatele z databáze
    await this.repository.delete({ id: userId });
    // Zneplatním token v lokální paměti
    await this.revokeTokenForUser(userId);
  }
}
