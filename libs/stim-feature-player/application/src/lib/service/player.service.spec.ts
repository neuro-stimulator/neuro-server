import { Test, TestingModule } from '@nestjs/testing';

import {
  createEmptyExperiment,
  createEmptyExperimentResult,
  Experiment,
  ExperimentResult,
  ExperimentStopConditionType,
  IOEvent,
  Output,
  PlayerConfiguration,
} from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentStopCondition,
  ExperimentResultIsNotInitializedException,
  NoStopCondition,
  PlayerLocalConfiguration,
} from '@diplomka-backend/stim-feature-player/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let testingModule: TestingModule;
  let service: PlayerService;
  let experiment: Experiment<Output>;
  let experimentStopCondition: ExperimentStopCondition;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<PlayerService>(PlayerService);

    experiment = createEmptyExperiment();
    experiment.id = 1;
    experiment.name = 'test';
    experimentStopCondition = { canContinue: jest.fn().mockReturnValue(true), stopConditionType: -1, stopConditionParams: {} };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pushResultData()', () => {
    const data: IOEvent = { name: 'ioEvent', index: 0, ioType: 'input', state: 'on', timestamp: 0 };

    it('positive - should push result data to collection', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      service.pushResultData(data);

      expect(service.activeExperimentResultData).toContain(data);
    });

    it('negative - should not push result data to uninitialized expeirment result', () => {
      expect(() => service.pushResultData(data)).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('nextExperimentRound()', () => {
    it('positive - should return zero when experiment result is initialized', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      const firstRound = service.experimentRound;

      expect(firstRound).toBe(0);
    });

    it('positive - should increase experiment round', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);
      service.nextExperimentRound();

      const secondRound = service.experimentRound;

      expect(secondRound).toBe(1);
    });

    it('negative - should not increase experiment round when experiment result is not initialized', () => {
      expect(() => service.nextExperimentRound()).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('scheduleNextRound()', () => {
    it('positive - should schedule next round', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 10;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.isBreakTime).toBeFalsy();
      const nextRoundPromise = service.scheduleNextRound();
      expect(service.isBreakTime).toBeTruthy();

      await expect(nextRoundPromise).resolves.toBeUndefined();
      expect(service.isBreakTime).toBeFalsy();
    });

    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.scheduleNextRound()).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('playerConfiguration', () => {
    it('positive - should return empty player configuration', async () => {
      const stopCondition: ExperimentStopCondition = new NoStopCondition();
      const expectedConfiguration: PlayerConfiguration = {
        initialized: false,
        betweenExperimentInterval: 0,
        autoplay: false,
        ioData: [],
        isBreakTime: false,
        repeat: 0,
        stopConditionType: stopCondition.stopConditionType,
        stopConditions: stopCondition.stopConditionParams,
      };

      expect(service.playerConfiguration).toEqual(expectedConfiguration);
    });
  });

  describe('playerConfiguration', () => {
    it('positive - should return empty player configuration', async () => {
      const stopCondition: ExperimentStopCondition = new NoStopCondition();
      const expectedConfiguration: PlayerLocalConfiguration = {
        userID: -1,
        initialized: false,
        betweenExperimentInterval: 0,
        autoplay: false,
        ioData: [],
        isBreakTime: false,
        repeat: 0,
        stopConditionType: stopCondition.stopConditionType,
        stopConditions: stopCondition.stopConditionParams,
      };

      expect(service.playerLocalConfiguration).toEqual(expectedConfiguration);
    });
  });

  describe('activeExperimentResult', () => {
    it('positive - should create new active experiment result', () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      const expected: ExperimentResult = createEmptyExperimentResult(experiment);
      expected.date = service.activeExperimentResult.date;

      expect(service.activeExperimentResult).toEqual(expected);
    });

    it('positive - should clear active experiment result', () => {
      expect(() => service.activeExperimentResult).toThrow(new ExperimentResultIsNotInitializedException());

      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);
      expect(service.activeExperimentResult).toBeDefined();

      service.clearRunningExperimentResult();
      expect(() => service.activeExperimentResult).toThrow(new ExperimentResultIsNotInitializedException());
    });

    it('negative - should not return data from noninitiailzed experiment result', () => {
      expect(() => service.clearRunningExperimentResult()).toThrow(new ExperimentResultIsNotInitializedException());

    });

    it('negative - should not create another active experiment result', () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      const existingExperimentResult = service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(() => service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval))
      .toThrow(new AnotherExperimentResultIsInitializedException(existingExperimentResult, experiment));
    });
  });

  describe('activeExperimentResultData', () => {
    it('negative - should not return data from noninitialized experiment result', () => {
      expect(() => service.activeExperimentResultData).toThrow(new ExperimentResultIsNotInitializedException());
      // try {
      //   const resultData = service.activeExperimentResultData;
      //   done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      // } catch (e) {
      //   if (e instanceof ExperimentResultIsNotInitializedException) {
      //     done();
      //   } else {
      //     done.fail('Unknown exception was thrown!');
      //   }
      // }
    });
  });

  describe('experimentResultData', () => {
    it('positive - should return experiment result data', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      const resultData: IOEvent[][] = service.experimentResultData;

      expect(resultData).toEqual([[]]);
    });

    it('negative - should not return data from noninitiailzed experiment result', () => {
      expect(() => service.experimentResultData).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('experimentRound', () => {
    it('negative - should throw exception when experiment result is not initialized', async () => {
      expect(() => service.experimentRound).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('experimentRepeat', () => {
    it('positive - should set experiment repeat before experiment is initialized', () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.experimentRepeat).toBe(experimentRepeat);
    });

    it('negative - should throw exception when experiment result is not initialized', () => {
      expect(() => service.experimentRepeat).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('canExperimentContinue', () => {
    it('positive - should return true, when experiment can continue', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.canExperimentContinue).toEqual(true);
    });

    it('positive - should return false, when experiment can not continue', async () => {
      experimentStopCondition = { canContinue: jest.fn().mockReturnValue(false), stopConditionType: -1, stopConditionParams: {} };
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.canExperimentContinue).toEqual(false);
    });

    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.canExperimentContinue).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('nextRoundAvailable', () => {
    it('positive - should return true, when next round is available', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      const nextRoundAvailable = service.nextRoundAvailable;

      expect(nextRoundAvailable).toBeTruthy();
    });

    it('positive - should return false, when next round is not available', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);
      service.nextExperimentRound();
      service.nextExperimentRound();

      const nextRoundAvailable = service.nextRoundAvailable;

      expect(nextRoundAvailable).toBeFalsy();
    });

    it('negative - should thow exception when experiment result is not initialized', async () => {
      expect(() => service.nextRoundAvailable).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('autoplay', () => {
    it('positive - should get and set autoplay parameter', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;
      const autoplay = true;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

      let autoplayFromService = service.autoplay;

      expect(autoplayFromService).toEqual(autoplay);
      service.autoplay = !autoplay;
      autoplayFromService = service.autoplay;
      expect(autoplayFromService).toEqual(!autoplay);
    });

    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.autoplay).toThrow(new ExperimentResultIsNotInitializedException());
    });

    it('negative - should thow exception when trying to set autoplay flag when experiment result is not initialized', () => {
      expect(() => service.autoplay = false).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('betweenExperimentInterval', () => {
    it('positive - should return true, when experiment can continue', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.betweenExperimentInterval).toEqual(betweenExperimentInterval);
    });

    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.betweenExperimentInterval).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('isBreakTime', () => {
    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.isBreakTime).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('stopConditionType', () => {
    it('positive - should return true, when experiment can continue', () => {
      const experimentStopCondition = {
        canContinue: jest.fn().mockReturnValue(true),
        stopConditionType: ExperimentStopConditionType.COUNTING_CYCLE_STOP_CONDITION,
        stopConditionParams: {},
      };
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.stopConditionType).toEqual(experimentStopCondition.stopConditionType);
    });

    it('negative - should thow exception when experiment result is not initialized', () => {
      expect(() => service.stopConditionType).toThrow(new ExperimentResultIsNotInitializedException());
    });
  });

  describe('userID', () => {
    it('positive - should return user id', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.userID).toEqual(userID);
    });

    it('negative - should return empty user id when experiment result is not initialized', async () => {
      expect(service.userID).toBeUndefined();
    });
  });
});
