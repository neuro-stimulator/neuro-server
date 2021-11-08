import { ExecutionContext } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createMock } from '@golevelup/ts-jest';

import { CommandFromStimulator, MessageCodes, User } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { StimulatorActionType } from '@neuro-server/stim-feature-stimulator/domain';
import { PlayerLocalConfiguration } from '@neuro-server/stim-feature-player/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorFacade } from '../service/stimulator.facade';
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

  it('negative - should not switch to same state', () => {
    const properties: LocalProperties = {
      action: 'clear',
      lastKnowStimulatorState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED
    };
    const context = setProperties(properties);

    expect(() => guard.canActivate(context))
    .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_ALREADY_IN_REQUESTED_STATE, { state: properties.lastKnowStimulatorState }));
  });

  it('negative - should not execute an action when player is not initialized', () => {
    const properties: LocalProperties = {
      playerLocalConfiguration: {
        initialized: false,
        userID: defaultUser.id
      }
    };
    const context = setProperties(properties);

    expect(() => guard.canActivate(context))
    .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_PLAYER_NOT_INITIALIZED));
  });

  it('negative - should not execute an action when user is not owner of player', () => {
    const properties: LocalProperties = {
      playerLocalConfiguration: {
        initialized: true,
        userID: defaultUser.id
      },
      user: { id: defaultUser.id + 10 }
    };
    const context = setProperties(properties);

    expect(() => guard.canActivate(context))
    .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED));
  });

  it('negative - should not allow execute action in wrong state', () => {
    const properties: LocalProperties = {
      action: 'clear',
      lastKnowStimulatorState: CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING
    };
    const context = setProperties(properties);

    expect(() => guard.canActivate(context))
    .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_STIMULATOR_ACTION_NOT_POSSIBLE));
  });

  interface LocalProperties {
    user?: Partial<User>;
    action?: StimulatorActionType;
    lastKnowStimulatorState?: number;
    playerLocalConfiguration?: Partial<PlayerLocalConfiguration> & { initialized: boolean; userID: number };
    currentState?: number;
  }
});
