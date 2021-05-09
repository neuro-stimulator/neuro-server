import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import DoneCallback = jest.DoneCallback;

import { User } from '@stechy1/diplomka-share';

import { UnauthorizedException } from '@diplomka-backend/stim-feature-auth/domain';
import { IsAuthorizedGuard } from './is-authorized.guard';
import { NoOpLogger } from '../../../../../../test-helpers/test-helpers';

describe('IsAuthorizedGuard', () => {
  const defaultParameters: ExecutionContextParameters = {
      user: {
        id: 0
      }
  };

  let testingModule: TestingModule;
  let guard: IsAuthorizedGuard;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IsAuthorizedGuard,
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    guard = testingModule.get<IsAuthorizedGuard>(IsAuthorizedGuard);
  });

  function mockExecutionContext(params?: ExecutionContextParameters): ExecutionContext {
    const parameters = Object.assign({ ...defaultParameters }, params);
    return createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: parameters.user
        })
      })
    });
  }

  it('positive - should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('positive - should pass user when object is available', async () => {
    const context: ExecutionContext = mockExecutionContext();

    const result = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when user object is not available', async (done: DoneCallback) => {
    const context: ExecutionContext = mockExecutionContext({
      user: undefined
    });

    try {
      await guard.canActivate(context);
      done.fail('UnauthorizedException was not thrown!');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      done();
    }
  });


  interface ExecutionContextParameters {
    user: Partial<User>
  }
});
