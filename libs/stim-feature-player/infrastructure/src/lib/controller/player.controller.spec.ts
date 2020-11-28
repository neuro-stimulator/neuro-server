import { Test, TestingModule } from '@nestjs/testing';

import {
  createEmptyExperiment,
  createEmptyExperimentResult,
  Experiment,
  ExperimentResult,
  ExperimentStopConditionType,
  ExperimentType,
  MessageCodes,
  Output,
  PlayerConfiguration,
  ResponseObject,
} from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { PlayerFacade } from '../service/player.facade';
import { PlayerController } from './player.controller';
import { createPlayerFacadeMock } from '../service/player.facade.jest';
import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { AnotherExperimentResultIsInitializedException, UnsupportedExperimentStopConditionException } from '@diplomka-backend/stim-feature-player/domain';
import DoneCallback = jest.DoneCallback;
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';

describe('PlayerFacade', () => {
  let testingModule: TestingModule;
  let controller: PlayerController;
  let facade: MockType<PlayerFacade>;
  let playerConfiguration: PlayerConfiguration;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerController,
        {
          provide: PlayerFacade,
          useFactory: createPlayerFacadeMock,
        },
      ],
    }).compile();

    controller = testingModule.get<PlayerController>(PlayerController);
    // @ts-ignore
    facade = testingModule.get<MockType<PlayerFacade>>(PlayerFacade);

    playerConfiguration = {
      repeat: 0,
      betweenExperimentInterval: 0,
      autoplay: false,
      stopConditionType: -1,
      stopConditions: {},
      isBreakTime: false,
      ioData: [],
      initialized: false,
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlayerState()', () => {
    it('positive - should return player state', async () => {
      facade.getPlayerState.mockReturnValueOnce(playerConfiguration);

      const result: ResponseObject<PlayerConfiguration> = await controller.getPlayerState();
      const expected: ResponseObject<PlayerConfiguration> = { data: playerConfiguration };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      facade.getPlayerState.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await controller.getPlayerState();
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
        done();
      }
    });
  });

  describe('getStopConditions()', () => {
    it('positive - should return player state', async () => {
      const experimentType: ExperimentType = ExperimentType.NONE;
      const stopConditionType: ExperimentStopConditionType[] = [];

      facade.getStopConditions.mockReturnValueOnce(stopConditionType);

      const result: ResponseObject<ExperimentStopConditionType[]> = await controller.getStopConditions(experimentType);
      const expected: ResponseObject<ExperimentStopConditionType[]> = { data: stopConditionType };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      const experimentType: ExperimentType = ExperimentType.NONE;

      facade.getStopConditions.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await controller.getStopConditions(experimentType);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
        done();
      }
    });
  });

  describe('prepare', () => {
    it('positive - should prepare experiment player', async () => {
      const experimentID = 1;
      const userID = 0;

      const result: ResponseObject<any> = await controller.prepare(experimentID, playerConfiguration, userID);
      const expected: ResponseObject<any> = {};

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when another experiment result is initialized', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;
      const initializedExperiment: Experiment<Output> = createEmptyExperiment();
      const initializedExperimentResult: ExperimentResult = createEmptyExperimentResult(initializedExperiment);

      facade.prepare.mockImplementationOnce(() => {
        throw new AnotherExperimentResultIsInitializedException(initializedExperimentResult, initializedExperiment);
      });

      try {
        await controller.prepare(experimentID, playerConfiguration, userID);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        const error: ControllerException = e;
        expect(error.errorCode).toBe(MessageCodes.CODE_ERROR);
        expect(error.params.initializedExperimentResult).toBe(initializedExperimentResult);
        done();
      }
    });

    it('negative - should throw exception when experiment does not support stop contidion', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;
      const stopConditionType: ExperimentStopConditionType = ExperimentStopConditionType.NO_STOP_CONDITION;

      facade.prepare.mockImplementationOnce(() => {
        throw new UnsupportedExperimentStopConditionException(stopConditionType);
      });

      try {
        await controller.prepare(experimentID, playerConfiguration, userID);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        const error: ControllerException = e;
        expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_PLAYER_UNSUPPORTED_STOP_CONDITION);
        expect(error.params.stopConditionType).toBe(stopConditionType);
        done();
      }
    });

    it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;

      facade.prepare.mockImplementationOnce(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      try {
        await controller.prepare(experimentID, playerConfiguration, userID);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        const error: ControllerException = e;
        expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
        expect(error.params.id).toBe(experimentID);
        done();
      }
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;

      facade.prepare.mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await controller.prepare(experimentID, playerConfiguration, userID);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ControllerException);
        const error: ControllerException = e;
        expect(error.errorCode).toBe(MessageCodes.CODE_ERROR);
        done();
      }
    });
  });
});
