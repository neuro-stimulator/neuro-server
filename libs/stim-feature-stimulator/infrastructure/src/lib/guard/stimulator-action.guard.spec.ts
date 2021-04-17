import DoneCallback = jest.DoneCallback;
import { ExecutionContext } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createMock } from '@golevelup/ts-jest';

import { CommandFromStimulator, MessageCodes, User } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { StimulatorActionType } from '@diplomka-backend/stim-feature-stimulator/domain';
import { PlayerLocalConfiguration } from '@diplomka-backend/stim-feature-player/domain';
import { StimulatorFacade } from '@diplomka-backend/stim-feature-stimulator/infrastructure';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorActionGuard } from './stimulator-action.guard';

describe('StimulatorActionGuard', () => {

  const defaultUser: Partial<User> = { id: 0 };
  const defaultProperties: LocalProperties = {
    user: defaultUser,
    action: 'upload',
    lastKnowStimulatorState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY,
    playerLocalConfiguration: {
      userID: defaultUser.id,
      initialized: true
    },
    currentState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY
  };

  let testingModule: TestingModule;
  let guard: StimulatorActionGuard;
  let mockStimulatorFacade: MockType<StimulatorFacade>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorActionGuard,
        {
          provide: StimulatorFacade,
          useValue: {
            getLastKnowStimulatorState: jest.fn(),
            getState: jest.fn()
          }
        },
        queryBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());
    guard = testingModule.get<StimulatorActionGuard>(StimulatorActionGuard);
    // @ts-ignore
    mockStimulatorFacade = testingModule.get<MockType<StimulatorFacade>>(StimulatorFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  function setProperties(props?: LocalProperties): ExecutionContext {
    const properties = Object.assign({ ...defaultProperties }, props);

    mockStimulatorFacade.getLastKnowStimulatorState.mockReturnValueOnce(properties.lastKnowStimulatorState);
    mockStimulatorFacade.getState.mockReturnValueOnce(properties.currentState);

    queryBus.execute.mockReturnValueOnce(properties.playerLocalConfiguration);

    return createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: properties.user,
          params: {
            'action': properties.action
          }
        })
      })
    });
  }

  it('positive - should allow to run action', async () => {
    const context = setProperties();

    const result: boolean = await guard.canActivate(context);

    expect(result).toBeTruthy();
  });

  it('negative - should not switch to same state', async (done: DoneCallback) => {
    const properties: LocalProperties = {
      action: 'clear',
      lastKnowStimulatorState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED
    };
    const context = setProperties(properties);

    try {
      await guard.canActivate(context);
      done.fail('ControllerException was not thrown!');
    } catch (e) {
      expect(e).toBeInstanceOf(ControllerException);
      const exception: ControllerException = e;
      expect(exception.errorCode).toBe(MessageCodes.CODE_ERROR_STIMULATOR_ALREADY_IN_REQUESTED_STATE);
      expect(exception.params).toEqual({ state: properties.lastKnowStimulatorState });
      done();
    }
  });

  it('negative - should not execute an action when player is not initialized', async (done: DoneCallback) => {
    const properties: LocalProperties = {
      playerLocalConfiguration: {
        initialized: false,
        userID: defaultUser.id
      }
    };
    const context = setProperties(properties);

    try {
      await guard.canActivate(context);
      done.fail('ControllerException was not thrown!');
    } catch (e) {
      expect(e).toBeInstanceOf(ControllerException);
      const exception: ControllerException = e;
      expect(exception.errorCode).toBe(MessageCodes.CODE_ERROR_STIMULATOR_PLAYER_NOT_INITIALIZED);
      done();
    }
  });

  it('negative - should not execute an action when user is not owner of player', async (done: DoneCallback) => {
    const properties: LocalProperties = {
      playerLocalConfiguration: {
        initialized: true,
        userID: defaultUser.id
      },
      user: { id: defaultUser.id + 10 }
    };
    const context = setProperties(properties);

    try {
      await guard.canActivate(context);
      done.fail('ControllerException was not thrown!');
    } catch (e) {
      expect(e).toBeInstanceOf(ControllerException);
      const exception: ControllerException = e;
      expect(exception.errorCode).toBe(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED);
      done();
    }
  });

  it('negative - should not allow execute action in wrong state', async (done: DoneCallback) => {
    const properties: LocalProperties = {
      action: 'clear',
      lastKnowStimulatorState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING
    };
    const context = setProperties(properties);

    try {
      await guard.canActivate(context);
      done.fail('ControllerException was not thrown!');
    } catch (e) {
      expect(e).toBeInstanceOf(ControllerException);
      const exception: ControllerException = e;
      expect(exception.errorCode).toBe(MessageCodes.CODE_ERROR_STIMULATOR_ACTION_NOT_POSSIBLE);
      done();
    }
  });

  interface LocalProperties {
    user?: Partial<User>;
    action?: StimulatorActionType;
    lastKnowStimulatorState?: number;
    playerLocalConfiguration?: Partial<PlayerLocalConfiguration> & { initialized: boolean; userID: number };
    currentState?: number;
  }
});
