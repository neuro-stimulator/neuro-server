import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import DoneCallback = jest.DoneCallback;
import { addMinutes, getUnixTime, subMinutes } from 'date-fns';

import {
  ACCESS_TOKEN_TTL,
  JWT_KEY,
  JwtPayload,
  LoginResponse,
  REFRESH_TOKEN_LENGTH,
  REFRESH_TOKEN_TTL, RefreshTokenEntity,
  RefreshTokenRepository,
  TokenContent, TokenNotFoundException
} from '@diplomka-backend/stim-feature-auth/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { refreshTokenRepositoryProvider, repositoryRefreshTokenEntityMock } from './repository-providers.jest';
import { TokenService } from './token.service';

describe('TokenService', () => {

  const jwtKey = 'jwtKey';
  const accessTokenTTL = 1;
  const refreshTokenTTL = 10;
  const refreshTokenLength = 64;

  let testingModule: TestingModule;
  let service: TokenService;

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
          provide: JWT_KEY,
          useValue: jwtKey,
        },
        {
          provide: ACCESS_TOKEN_TTL,
          useValue: accessTokenTTL,
        },
        {
          provide: REFRESH_TOKEN_TTL,
          useValue: refreshTokenTTL
        },
        {
          provide: REFRESH_TOKEN_LENGTH,
          useValue: refreshTokenLength,
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<TokenService>(TokenService);
  });

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccessToken()', () => {

    it('positive - should create new access token', async () => {
      const payload: JwtPayload = {
        sub: 1
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
        ipAddress: 'ip address',
        clientId: 'client id'
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
      const payload: JwtPayload = {
        sub: 1
      };
      const jwt = sign(payload, jwtKey);

      const jwtPayload: JwtPayload = await service.validateToken(jwt);

      expect(jwtPayload).toEqual(expect.objectContaining({
        sub: payload.sub
      } as Partial<JwtPayload>));
    });

    it('negative - should throw an exception when token is not valid', async (done: DoneCallback) => {
      const payload: JwtPayload = {
        sub: 1
      };
      const jwt = sign(payload, 'wrongKey');

      try {
        await service.validateToken(jwt);
        done.fail('Exception was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(JsonWebTokenError);
        done();
      }
    })
  });

  describe('validatePayload()', () => {
    it('positive - should validate payload', async () => {
      const payload: JwtPayload = {
        sub: 1,
        exp: getUnixTime(addMinutes(new Date(), 1))
      };

      const payloadData: { id: number } = await service.validatePayload(payload);

      expect(payloadData.id).toEqual(payload.sub);
    });

    it('negative - should return null when payload is not valid', async () => {
      const payload: JwtPayload = {
        sub: 1,
        exp: getUnixTime(subMinutes(new Date(), 1))
      };

      const payloadData = await service.validatePayload(payload);

      expect(payloadData).toBeNull()
    });

    it('negative - should return null when payload is blacklisted', async () => {
      const payload: JwtPayload = {
        sub: 1,
        exp: getUnixTime(addMinutes(new Date(), 2))
      };

      await service.deleteRefreshToken(payload.sub, 'random refresh token');

      const payloadData = await service.validatePayload(payload);

      expect(payloadData).toBeNull();
    });

    it('negative - should return null when payload is blacklisted', async () => {
      const payload: JwtPayload = {
        sub: 1,
        exp: getUnixTime(addMinutes(new Date(), 2))
      };

      await service.deleteRefreshTokenForUser(payload.sub);

      const payloadData = await service.validatePayload(payload);

      expect(payloadData).toBeNull();
    });
  });

  describe('refreshJWT()', () => {
    it('positive - should refresh JWT', async () => {
      const refreshToken = 'refresh token';
      const clientId = 'client id';
      const ipAddress = 'ip address';
      const userId = 1;

      const token = new RefreshTokenEntity();
      token.userId = userId;

      repositoryRefreshTokenEntityMock.findOne.mockReturnValueOnce(token);

      const [accessToken, usrId] = await service.refreshJWT(refreshToken, clientId, ipAddress);

      expect(accessToken).toBeDefined();
      expect(usrId).toEqual(userId);
    });

    it('negative - should throw exception when token not found', async (done: DoneCallback) => {
      const refreshToken = 'refresh token';
      const clientId = 'client id';
      const ipAddress = 'ip address';
      repositoryRefreshTokenEntityMock.findOne.mockReturnValue(null);

      try {
        await service.refreshJWT(refreshToken, clientId, ipAddress);
        done.fail('TokenNotFoundException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(TokenNotFoundException);
        done();
      }
    });
  });

});
