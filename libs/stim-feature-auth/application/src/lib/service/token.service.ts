import { Inject, Injectable, Logger } from '@nestjs/common';

import { sign, SignOptions, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import * as moment from 'moment';

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
  TokenExpiredException,
} from '@diplomka-backend/stim-feature-auth/domain';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);

  private readonly accessTokenTTL;
  private readonly refreshTokenTTL;

  private readonly signOptions: SignOptions;
  private readonly usersExpired: number[] = [];

  constructor(
    @Inject(JWT_KEY) private readonly jwtKey: string = 'DEMO_KEY',
    @Inject(ACCESS_TOKEN_TTL) ttlToken = 10,
    @Inject(REFRESH_TOKEN_LENGTH) private readonly refreshTokenLength: number = 64,
    private readonly repository: RefreshTokenRepository
  ) {
    this.accessTokenTTL = ttlToken || 60 * 5; // 5m
    this.refreshTokenTTL = ttlToken || 30; // 30 days
    this.signOptions = { expiresIn: this.accessTokenTTL };
  }

  /**
   * Kontrola, zdali je uživatelův token expirovaný
   *
   * @param userID ID uživatele
   * @param expire Doba platnosti
   */
  private async isBlackListed(userID: number, expire: number): Promise<boolean> {
    return this.usersExpired[userID] && expire < this.usersExpired[userID];
  }

  /**
   * Znehodnotí zadaný
   *
   * @param userID
   */
  private async revokeTokenForUser(userID: number): Promise<any> {
    this.logger.verbose(`Zneplatňuji refresh token pro uživatele: ${userID}.`);
    this.usersExpired[userID] = moment().add(this.refreshTokenTTL, 's').unix();
  }

  /**
   * Vygeneruje a podepíše přístupový token
   *
   * @param payload JwtPayload
   * @param expires number
   */
  public async createAccessToken(payload: JwtPayload, expires = this.accessTokenTTL): Promise<LoginResponse> {
    this.logger.verbose('Generují nový JWT.');
    // If expires is negative it means that token should not expire
    const options: SignOptions = this.signOptions;
    expires > 0 ? (options.expiresIn = expires) : delete options.expiresIn;
    // Vygeneruji unikátní UUID pro token
    options.jwtid = uuidv4();
    // Podepíšu payload
    const signedPayload = sign(payload, this.jwtKey, options);

    return {
      accessToken: signedPayload,
      expiresIn: moment().add(expires, 'seconds').toDate(),
    };
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
    token.expiresAt = moment().add(this.refreshTokenTTL, 'd').toDate().getTime();

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
   * Ověří, že payload není na blacklistu
   *
   * @param payload JwtPayload
   */
  public async validatePayload(payload: JwtPayload): Promise<{ id: number }> {
    this.logger.verbose('Validuji payload.');
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
   * @param oldAccessToken string Aktuální JWT
   * @param clientId string Id klientské aplikace
   * @param ipAddress Ip adresa klienta
   * @throws TokenNotFoundException Pokud refresh token nebyl nalezen v databázi
   * @throws TokenExpiredException Pokud je token za svojí dobou expirace
   * @throws JsonWebTokenError Pokud nastane problém s tokenem
   * @throws NotBeforeError Pokud token ještě nebyl aktivován
   */
  public async refreshJWT(refreshToken: string, oldAccessToken: string, clientId: string, ipAddress: string): Promise<[LoginResponse, number]> {
    this.logger.verbose('Obnovuji zadaný JWT.');
    const token = await this.repository.one({ value: refreshToken });
    const currentDate = Date.now();
    if (!token) {
      throw new TokenNotFoundException();
    }
    if (token.expiresAt < currentDate) {
      throw new TokenExpiredException();
    }

    // Refresh token je stále validní, můžu tedy vygenerovat nový
    const oldPayload: JwtPayload = await this.validateToken(oldAccessToken, true);
    const payload: JwtPayload = {
      sub: oldPayload.sub,
    };
    // Vytvořím nový JWT
    const accessToken: LoginResponse = await this.createAccessToken(payload);
    // Z databáze odstraním starý refresh token
    await this.repository.delete({ id: token.id });
    // Vytvořím nový refresh token
    accessToken.refreshToken = await this.createRefreshToken({
      userId: oldPayload.sub,
      clientId,
      ipAddress,
    });

    return [accessToken, payload.sub];
  }

  /**
   * Vymeže jeden refresh token pro zadaného uživatele
   *
   * @param userId number Id uživatele
   * @param refreshToken string Refresh token
   */
  public async deleteRefreshToken(userId: number, refreshToken: string) {
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
  public async deleteRefreshTokenForUser(userId: number) {
    this.logger.verbose(`Mažu všechny refresh tokeny pro uživatele: ${userId}.`);
    // Vymažu všechy tokeny pro zadaného uživatele z databáze
    await this.repository.delete({ id: userId });
    // Zneplatním token v lokální paměti
    await this.revokeTokenForUser(userId);
  }
}
