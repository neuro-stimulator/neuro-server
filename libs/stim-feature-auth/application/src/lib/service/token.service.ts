import { Inject, Injectable, Logger } from '@nestjs/common';

import { sign, SignOptions, verify } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { addMinutes, getTime, getUnixTime } from 'date-fns';

import { User, UserGroups } from '@stechy1/diplomka-share';

import {
  LoginResponse,
  TokenContent,
  RefreshTokenRepository,
  RefreshTokenEntity,
  TokenNotFoundException,
  AUTH_MODULE_CONFIG_CONSTANT,
  AuthModuleConfig,
  JwtPayload
} from '@neuro-server/stim-feature-auth/domain';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);

  private readonly usersExpired: Record<string, number>[] = [];

  constructor(
    @Inject(AUTH_MODULE_CONFIG_CONSTANT) private readonly config: AuthModuleConfig,
    private readonly repository: RefreshTokenRepository
  ) {
  }

  /**
   * Kontrola, zda-li je uživatelův token expirovaný
   *
   * @param userUUID UUID uživatele
   * @param clientID ID klienta, ve kterém by měl být uživatel přihlášen
   * @param expire Doba platnosti
   */
  private async isBlackListed(userUUID: string, clientID: string, expire: number): Promise<boolean> {
    if (this.usersExpired[userUUID] && this.usersExpired[userUUID][clientID]) {
      const expired = this.usersExpired[userUUID][clientID] < getUnixTime(this.getCurrentDate());
      if (expired) {
        this.logger.verbose('Uživateli vypršelo sezení - záznam byl nalezen v cache.');
      }
      return expired;
    }

    // const entity: RefreshTokenEntity = await this.repository.one({ value: refreshTOken });
    // const invalid = (!entity || entity.expiresAt < this.getCurrentDate.getTime())
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
   * @param userID ID uživatele
   * @param clientID ID klienta, ze kterého je uživatel přihlášen
   */
  private async revokeTokenForUser(userID: string, clientID?: string): Promise<void> {
    this.logger.verbose(`Zneplatňuji refresh token pro uživatele: ${userID}.`);
    if (!this.usersExpired[userID]) {
      this.usersExpired[userID] = {};
    }
    if (clientID) {
      this.usersExpired[userID][clientID] = -1;
    } else {
      for (const oneClientId of Object.keys(this.usersExpired[userID])) {
        this.usersExpired[userID][oneClientId] = -1;
      }
    }
  }

  private getCurrentDate(): Date {
    return new Date(Date.now());
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
      expiresIn: this.config.jwt.accessTokenTTL * 60
    };
    // Podepíšu payload
    const signedPayload = sign(payload, this.config.jwt.secretKey, options);

    const response: LoginResponse = {
      accessToken: signedPayload,
      expiresIn: addMinutes(this.getCurrentDate(), this.config.jwt.accessTokenTTL)
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
    const refreshToken = randomBytes(this.config.jwt.refreshTokenLength).toString('hex');

    token.userId = tokenContent.userId;
    token.uuid = tokenContent.uuid;
    token.value = refreshToken;
    token.ipAddress = tokenContent.ipAddress;
    token.clientId = tokenContent.clientId;
    token.expiresAt = getTime(addMinutes(this.getCurrentDate(), this.config.jwt.refreshTokenTTL));
    token.userGroups = tokenContent.userGroups;

    await this.repository.insert(token);

    if (!this.usersExpired[tokenContent.uuid]) {
      this.usersExpired[tokenContent.uuid] = {};
    }
    this.usersExpired[tokenContent.uuid][tokenContent.clientId] = getUnixTime(token.expiresAt);

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
    return verify(jwt, this.config.jwt.secretKey, { ignoreExpiration }) as JwtPayload;
  }

  /**
   * Ověří, že payload je stále validní za pomoci expirační doby a případně blacklistu.
   *
   * @param payload JwtPayload
   * @param refreshToken string Refresh token
   * @param clientID ID klienta, ze kterého přišel požadavek
   * @return Pick<User, 'id' | 'uuid'> ID a UUID přihlášeného uživatele
   */
  public async validatePayload(payload: JwtPayload, refreshToken: string, clientID: string): Promise<Pick<User, 'id' | 'uuid' | 'userGroups'>> {
    const now = getUnixTime(this.getCurrentDate());
    this.logger.verbose('Validuji payload. EXP=' + payload.exp + ', now=' + now);
    if (payload.exp < now) {
      this.logger.verbose('Payload expiroval!');
      return null;
    }

    const tokenBlacklisted = await this.isBlackListed(payload.sub, clientID, payload.exp);
    if (!tokenBlacklisted) {
      const entity: RefreshTokenEntity = await this.repository.one({ value: refreshToken });
      return {
        id: entity.userId,
        uuid: entity.uuid,
        userGroups: payload.userGroups
      };
    } else {
      this.logger.verbose('Token je na blacklistu! Uživatel nebude autorizován.');
      return null;
    }
  }

  /**
   * Vytvoří nový JWT ze stávajícího s prodlouženou dobou expirace
   *
   * @param refreshToken string Aktuální refresh token
   * @param clientId string Id klientské aplikace
   * @param ipAddress Ip adresa klienta
   * @return [LoginResponse, number, string] LoginResponse, ID uživatele, UUID uživatele
   * @throws TokenNotFoundException Pokud refresh token nebyl nalezen v databázi
   * @throws JsonWebTokenError Pokud nastane problém s tokenem
   * @throws NotBeforeError Pokud token ještě nebyl aktivován
   */
  public async refreshJWT(refreshToken: string, clientId: string, ipAddress: string): Promise<[LoginResponse, number, string]> {
    this.logger.verbose('Obnovuji zadaný JWT.');
    const token: RefreshTokenEntity = await this.repository.one({ value: refreshToken });
    if (!token) {
      throw new TokenNotFoundException(refreshToken);
    }

    const payload: JwtPayload = {
      sub: token.uuid,
      userGroups: JSON.parse(token.userGroups) as UserGroups
    };
    // Vytvořím nový JWT
    const accessToken: LoginResponse = await this.createAccessToken(payload);
    // Z databáze odstraním starý refresh token
    await this.repository.delete({ id: token.id });
    // Vytvořím si nový obsah tokenu
    const tokenContent: TokenContent = {
      userId: token.userId,
      uuid: token.uuid,
      clientId,
      ipAddress,
      userGroups: token.userGroups
    }
    // Vytvořím nový refresh token
    accessToken.refreshToken = await this.createRefreshToken(tokenContent);

    return [accessToken, token.userId, token.uuid];
  }

  /**
   * Vymeže jeden refresh token pro zadaného uživatele
   *
   * @param userUUID uuid UUID uživatele
   * @param clientID ID klienta, ze kterého se má odstranit pro uživatele přístup
   * @param refreshToken string Refresh token
   */
  public async deleteRefreshToken(userUUID: string, clientID: string, refreshToken: string): Promise<void> {
    this.logger.verbose(`Mažu jeden refresh token pro uživatele: ${userUUID}.`);
    // Vymažu jeden token z databáze
    await this.repository.delete({ value: refreshToken });
    // Zneplatním token v lokální paměti
    await this.revokeTokenForUser(userUUID, clientID);
  }

  /**
   * Vymeže všechny refresh tokeny pro zadaného uživatele
   *
   * @param userUUID UUID Id uživatele
   */
  public async deleteRefreshTokenForUser(userUUID: string): Promise<void> {
    this.logger.verbose(`Mažu všechny refresh tokeny pro uživatele: ${userUUID}.`);
    // Vymažu všechy tokeny pro zadaného uživatele z databáze
    await this.repository.delete({ uuid: userUUID });
    // Zneplatním token v lokální paměti
    await this.revokeTokenForUser(userUUID);
  }
}
