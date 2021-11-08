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

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { AnotherExperimentResultIsInitializedException, UnsupportedExperimentStopConditionException } from '@neuro-server/stim-feature-player/domain';
import { ExperimentIdNotFoundException } from '@neuro-server/stim-feature-experiments/domain';

import { PlayerFacade } from '../service/player.facade';
import { createPlayerFacadeMock } from '../service/player.facade.jest';
import { PlayerController } from './player.controller';

describe('PlayerController', () => {
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
    testingModule.useLogger(new NoOpLogger());

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

    it('negative - should throw exception when unexpected error occured', () => {
      facade.getPlayerState.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.getPlayerState()).rejects.toThrow(new ControllerException());
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

    it('negative - should throw exception when unexpected error occured', () => {
      const experimentType: ExperimentType = ExperimentType.NONE;

      facade.getStopConditions.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.getStopConditions(experimentType)).rejects.toThrow(new ControllerException());
    });
  });

  describe('prepare', () => {
    it('positive - should prepare experiment player', async () => {
      const experimentID = 1;
      const userID = 0;
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const userGroups = [1];

      facade.prepare.mockReturnValueOnce(experimentResult)

      const result: ResponseObject<ExperimentResult> = await controller.prepare(experimentID, playerConfiguration, userID, userGroups);
      const expected: ResponseObject<ExperimentResult> = { data: experimentResult };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when another experiment result is initialized', () => {
      const experimentID = 1;
      const userID = 0;
      const initializedExperiment: Experiment<Output> = createEmptyExperiment();
      const initializedExperimentResult: ExperimentResult = createEmptyExperimentResult(initializedExperiment);
      const userGroups = [1];

      facade.prepare.mockImplementationOnce(() => {
        throw new AnotherExperimentResultIsInitializedException(initializedExperimentResult, initializedExperiment);
      });

      expect(() => controller.prepare(experimentID, playerConfiguration, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_PLAYER_ANOTHER_EXPERIMENT_RESULT_IS_INITIALIZED, { initializedExperimentResult}));
    });

    it('negative - should throw exception when experiment does not support stop contidion', () => {
      const experimentID = 1;
      const userID = 0;
      const stopConditionType: ExperimentStopConditionType = ExperimentStopConditionType.NO_STOP_CONDITION;
      const userGroups = [1];

      facade.prepare.mockImplementationOnce(() => {
        throw new UnsupportedExperimentStopConditionException(stopConditionType);
      });

      expect(() => controller.prepare(experimentID, playerConfiguration, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_PLAYER_UNSUPPORTED_STOP_CONDITION, { stopConditionType }));
    });

    it('negative - should throw exception when experiment not found', () => {
      const experimentID = 1;
      const userID = 0;
      const userGroups = [1];

      facade.prepare.mockImplementationOnce(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      expect(() => controller.prepare(experimentID, playerConfiguration, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experimentID}));
    });

    it('negative - should throw exception when unexpected error occured', () => {
      const experimentID = 1;
      const userID = 0;
      const userGroups = [1];

      facade.prepare.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.prepare(experimentID, playerConfiguration, userID, userGroups)).rejects.toThrow(new ControllerException());
    });
  });
});
