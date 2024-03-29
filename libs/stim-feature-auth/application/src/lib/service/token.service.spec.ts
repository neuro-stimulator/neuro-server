import { addMinutes, getUnixTime, subMinutes } from 'date-fns';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { EntityManager } from 'typeorm';

import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AclPartial, createEmptyUser, User } from '@stechy1/diplomka-share';

import {
  AUTH_MODULE_CONFIG_CONSTANT,
  AuthModuleConfig,
  LoginResponse,
  RefreshTokenEntity,
  RefreshTokenRepository,
  TokenContent,
  TokenNotFoundException,
  JwtPayload
} from '@neuro-server/stim-feature-auth/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { refreshTokenRepositoryProvider, repositoryRefreshTokenEntityMock } from './repository-providers.jest';
import { TokenService } from './token.service';

describe('TokenService', () => {

  const jwtKey = 'jwtKey';
  const accessTokenTTL = 1;
  const refreshTokenTTL = 10;
  const refreshTokenLength = 64;
  const timezone = 'Europe/Prague';
  const config: AuthModuleConfig = {
    jwt: {
      secretKey: jwtKey,
      accessTokenTTL,
      refreshTokenTTL,
      refreshTokenLength,
      timezone
    }
  }

  let testingModule: TestingModule;
  let service: TokenService;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        refreshTokenRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [RefreshTokenRepository]
        },
        {
          provide: AUTH_MODULE_CONFIG_CONSTANT,
          useValue: config
        },
        queryBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<TokenService>(TokenService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  function prepareRefreshToken(userId = 1, uuid = 'uuid', value = 'value'): RefreshTokenEntity {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.id = 1;
    refreshToken.userId = userId;
    refreshToken.uuid = uuid;
    refreshToken.value = value

    return refreshToken;
  }

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessToken()', () => {

    it('positive - should create new access token', async () => {
      const uuid = 'uuid';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        userGroups,
        acl
      };

      const response: LoginResponse = await service.createAccessToken(payload);

      expect(response.accessToken).toBeDefined();
      expect(response.expiresIn).toBeDefined();

      const verifiedPayload: JwtPayload = verify(response.accessToken, jwtKey) as JwtPayload;

      expect(verifiedPayload.sub).toEqual(payload.sub);
    });

  });

  describe('createRefreshToken()', () => {
    it('positive - should create refresh token and insert it to database', async () => {
      const tokenContent: TokenContent = {
        userId: 1,
        uuid: 'uuid',
        ipAddress: 'ip address',
        clientId: 'client id',
        userGroups: '',
        acl: []
      };

      const refreshToken: string = await service.createRefreshToken(tokenContent);

      expect(refreshToken).toBeDefined();

      expect(repositoryRefreshTokenEntityMock.insert).toBeCalledWith(expect.objectContaining({
        userId: tokenContent.userId,
        ipAddress: tokenContent.ipAddress,
        clientId: tokenContent.clientId,
        value: refreshToken
      } as Partial<RefreshTokenEntity>))
    });
  });

  describe('validateToken()', () => {
    it('positive - should validate token', async () => {
      const uuid = 'uuid';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        userGroups,
        acl
      };
      const jwt = sign(payload, jwtKey);

      const jwtPayload: JwtPayload = await service.validateToken(jwt);

      expect(jwtPayload).toEqual(expect.objectContaining({
        sub: payload.sub
      } as Partial<JwtPayload>));
    });

    it('negative - should throw an exception when token is not valid', () => {
      const uuid = 'uuid';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        userGroups,
        acl
      };
      const jwt = sign(payload, 'wrongKey');

      const rejection = expect(async () => service.validateToken(jwt)).rejects;

      return Promise.all([
        rejection.toBeInstanceOf(JsonWebTokenError)
      ]);
    })
  });

  describe('validatePayload()', () => {
    it('positive - should validate payload', async () => {
      const userID = 1;
      const clientID = 'clientID';
      const uuid = 'uuid';
      const refreshToken = 'refreshToken';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        exp: getUnixTime(addMinutes(new Date(Date.now()), 1)),
        userGroups,
        acl
      };
      const refreshTokenEntity = prepareRefreshToken(userID, uuid);

      repositoryRefreshTokenEntityMock.findOne.mockReturnValueOnce(refreshTokenEntity);

      const payloadData: Pick<User, 'id' | 'uuid'> = await service.validatePayload(payload, refreshToken, clientID);

      expect(payloadData.id).toEqual(userID);
      expect(payloadData.uuid).toEqual(uuid);
    });

    it('negative - should return null when payload is not valid', async () => {
      const clientID = 'clientID';
      const uuid = 'uuid';
      const userGroups = {};
      const refreshToken = 'refreshToken';
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        exp: getUnixTime(subMinutes(new Date(Date.now()), 1)),
        userGroups,
        acl
      };

      const payloadData = await service.validatePayload(payload, refreshToken, clientID);

      expect(payloadData).toBeNull()
    });

    it('negative - should return null when payload is blacklisted', async () => {
      const clientID = 'clientID';
      const uuid = 'uuid';
      const refreshToken = 'refreshToken';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const payload: JwtPayload = {
        sub: uuid,
        exp: getUnixTime(addMinutes(new Date(Date.now()), 1)),
        userGroups,
        acl
      };

      await service.deleteRefreshToken(payload.sub, clientID, 'random refresh token');

      const payloadData = await service.validatePayload(payload, refreshToken, clientID);

      expect(payloadData).toBeNull();
    });

    it('negative - should return null when payload is deleted', async () => {
      const clientID = 'clientID';
      const uuid = 'uuid';
      const userGroups = {};
      const acl: AclPartial[] = [];
      const tokenContent: TokenContent = {
        userId: 1,
        uuid,
        ipAddress: 'ip address',
        clientId: clientID,
        userGroups: '',
        acl
      };
      const refreshToken = 'refreshToken';
      const payload: JwtPayload = {
        sub: uuid,
        exp: getUnixTime(addMinutes(new Date(), 2)),
        userGroups,
        acl
      };

      await service.createRefreshToken(tokenContent);
      await service.deleteRefreshTokenForUser(payload.sub);

      const payloadData = await service.validatePayload(payload, refreshToken, clientID);

      expect(payloadData).toBeNull();
    });
  });

  describe('refreshJWT()', () => {
    it('positive - should refresh JWT', async () => {
      const refreshToken = 'refresh token';
      const clientId = 'client id';
      const ipAddress = 'ip address';
      const uuid = 'uuid';
      const userId = 1;
      const user: User = createEmptyUser();
      user.id = userId;

      const token = new RefreshTokenEntity();
      token.userId = userId;
      token.userGroups = '{}';
      token.uuid = uuid

      queryBus.execute.mockReturnValueOnce(user);

      repositoryRefreshTokenEntityMock.findOne.mockReturnValueOnce(token);

      const [accessToken, usrId, _uuid] = await service.refreshJWT(refreshToken, clientId, ipAddress);

      expect(accessToken).toBeDefined();
      expect(usrId).toEqual(userId);
      expect(uuid).toEqual(_uuid);
    });

    it('negative - should throw exception when token not found', () => {
      const refreshToken = 'refresh token';
      const clientId = 'client id';
      const ipAddress = 'ip address';
      repositoryRefreshTokenEntityMock.findOne.mockReturnValue(null);

      const rejection = expect(async () => service.refreshJWT(refreshToken, clientId, ipAddress)).rejects;

      return Promise.all([
        rejection.toThrow(TokenNotFoundException)
      ]);
    });
  });

});
