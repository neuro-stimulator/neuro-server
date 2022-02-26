import { createMock } from '@golevelup/ts-jest';
import { addMinutes } from 'date-fns';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AclPartial, UserGroups } from '@stechy1/diplomka-share';

import { LoginResponse, UnauthorizedException, JwtPayload } from '@neuro-server/stim-feature-auth/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { TokenService } from '../service/token.service';
import { createTokenServiceMock } from '../service/token.service.jest';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const defaultParameters: ExecutionContextParameters = {
    cookies: {
      SESSIONID: 'sessionid',
      'XSRF-TOKEN': 'xsrf token value'
    },
    headers: {
      'x-xsrf-token': 'xsrf token value',
      'x-client-id': 'client id'
    },
    method: 'POST',
    ip: 'ipAddress'
  };

  let testingModule: TestingModule;
  let guard: AuthGuard;
  let service: MockType<TokenService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: TokenService,
          useFactory: createTokenServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    guard = testingModule.get<AuthGuard>(AuthGuard);
    // @ts-ignore
    service = testingModule.get<MockType<TokenService>>(TokenService);
  });

  function mockExecutionContext(params?: ExecutionContextParameters): ExecutionContext {
    const parameters = Object.assign({ ...defaultParameters }, params);
    return createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: parameters.cookies,
          headers: parameters.headers,
          method: parameters.method,
          header: jest.fn(),
          res: {
            cookie: jest.fn(),
            setHeader: jest.fn()
          }
        })
      })
    });
  }

  function mockService(userId: number, uuid: string, userGroups: UserGroups, acl: AclPartial[]) {
    const payload: JwtPayload = {
      sub: uuid,
      userGroups,
      acl
    }
    const userData: { id: number } = {
      id: userId
    }
    service.validateToken.mockReturnValueOnce(payload);
    service.validatePayload.mockReturnValueOnce(userData);
  }

  it('positive - should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('positive - should pass unauthorized user through guard to get data', async () => {
    const context: ExecutionContext = mockExecutionContext({
      cookies: {
        'XSRF-TOKEN': null,
        SESSIONID: null
      },
      headers: {
        'x-xsrf-token': null
      },
      method: 'GET'
    });

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('positive - should pass fully logged user through guard to get data', async () => {
    const userId = 1;
    const uuid = 'uuid';
    const userGroups = {};
    const acl: AclPartial[] = [];
    const context: ExecutionContext = mockExecutionContext({
      method: 'GET'
    });

    mockService(userId, uuid, userGroups, acl);

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('positive - should pass fully logged user with expired session through the guard to get data', async () => {
    const context: ExecutionContext = mockExecutionContext({
      cookies: {
        SESSIONID: null,
        'XSRF-TOKEN': defaultParameters.cookies['XSRF-TOKEN']
      },
      method: 'GET'
    });

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('positive - should pass fully logged user through the guard to modify data', async () => {
    const userId = 1;
    const uuid = 'uuid';
    const userGroups = {};
    const acl: AclPartial[] = [];
    const context: ExecutionContext = mockExecutionContext();

    mockService(userId, uuid, userGroups, acl);

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('positive - should pass fully logged user with expired session through the guard to modify data and refresh token', async () => {
    const userId = 1;
    const uuid = 'uuid';
    const loginResponse: LoginResponse = {
      user: {
        id: userId
      },
      accessToken: 'sessionid',
      expiresIn: addMinutes(new Date(), 5)
    }
    const context: ExecutionContext = mockExecutionContext({
      cookies: {
        SESSIONID: null,
        'XSRF-TOKEN': defaultParameters.cookies['XSRF-TOKEN']
      }
    });

    service.refreshJWT.mockReturnValueOnce([loginResponse, userId, uuid]);

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy()
  });

  it('negative - should not pass user without cookies', async () => {
    const context: ExecutionContext = mockExecutionContext({
      cookies: undefined
    });

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeFalsy();
  });

  it('negative - should throw an exception when session is over and user want modify data', () => {
    const context: ExecutionContext = mockExecutionContext({
      headers: {
        'x-xsrf-token': undefined,
        'x-client-id': defaultParameters.headers['x-client-id']
      }
    });

    expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException());
  });

  it('negative - should throw an exception when csrf cookie and header do not match', () => {
    const context: ExecutionContext = mockExecutionContext({
      cookies: {
        'XSRF-TOKEN': 'some xsrf cookie token'
      },
      headers: {
        'x-xsrf-token': 'some xsrf header token',
        'x-client-id': defaultParameters.headers['x-client-id']
      }
    });

    expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException());
  });

  it('negative - should throw an exception when refresh of token fail', () => {
    const context: ExecutionContext = mockExecutionContext({
      cookies: {
        SESSIONID: null,
        'XSRF-TOKEN': defaultParameters.cookies['XSRF-TOKEN']
      }
    });

    service.refreshJWT.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException());
  });

  it('negative - should throw an exception when JWT not valid', () => {
    const context: ExecutionContext = mockExecutionContext();

    service.validateToken.mockImplementationOnce(() => {
      throw Error();
    })

    expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException());
  });

  it('negative - should throw an exception when JWT contains invalid data', () => {
    const payload: JwtPayload = {
      sub: 'uuid',
      userGroups: {},
      acl: []
    }
    const context: ExecutionContext = mockExecutionContext();

    service.validateToken.mockReturnValueOnce(payload);
    service.validatePayload.mockReturnValueOnce(undefined);

    expect(guard.canActivate(context)).rejects.toThrow(new UnauthorizedException());
  });

  interface ExecutionContextParameters {
    cookies?: {
      'SESSIONID'?: string
      'XSRF-TOKEN'?: string
    },
    headers?: {
      'x-xsrf-token'?: string,
      'x-client-id'?: string
    },
    method?: 'GET'| 'POST'| 'PUT'| 'DELETE'| 'PATCH',
    ip?: string
  }
});
