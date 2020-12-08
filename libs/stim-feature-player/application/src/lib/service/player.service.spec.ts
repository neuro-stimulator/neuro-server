import { Test, TestingModule } from '@nestjs/testing';

import DoneCallback = jest.DoneCallback;

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

    it('negative - should not push result data to uninitialized expeirment result', (done: DoneCallback) => {
      try {
        service.pushResultData(data);
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should not increase experiment round when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        service.nextExperimentRound();
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        await service.scheduleNextRound();
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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
        userID: null,
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

    it('positive - should clear active experiment result', (done: DoneCallback) => {
      try {
        const emptyResult: ExperimentResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ExperimentResultIsNotInitializedException);
      }

      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);
      expect(service.activeExperimentResult).toBeDefined();

      service.clearRunningExperimentResult();
      try {
        const emptyResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ExperimentResultIsNotInitializedException);
      }

      done();
    });

    it('negative - should not return data from noninitiailzed experiment result', (done: DoneCallback) => {
      try {
        service.clearRunningExperimentResult();
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not create another active experiment result', (done: DoneCallback) => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      try {
        service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);
        done.fail('AnotherExperimentResultIsInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof AnotherExperimentResultIsInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('activeExperimentResultData', () => {
    it('negative - should not return data from noninitialized experiment result', (done: DoneCallback) => {
      try {
        const resultData = service.activeExperimentResultData;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should not return data from noninitiailzed experiment result', (done: DoneCallback) => {
      try {
        const experimentResultData = service.experimentResultData;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('experimentRound', () => {
    it('negative - should throw exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const experimentRound = service.experimentRound;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('experimentRepeat', () => {
    it('positive - should set experiment repeat before experiment is initialized', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      const userID = 0;

      service.createEmptyExperimentResult(userID, experiment, experimentStopCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.experimentRepeat).toBe(experimentRepeat);
    });

    it('negative - should throw exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const experimentRepeat = service.experimentRepeat;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const canContinue = service.canExperimentContinue;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const nextRoundAvailable = service.nextRoundAvailable;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const autoplay = service.autoplay;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should thow exception when trying to set autoplay flag when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        service.autoplay = false;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const betweenExperimentInterval = service.betweenExperimentInterval;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('isBreakTime', () => {
    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const betweenExperimentInterval = service.isBreakTime;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('stopConditionType', () => {
    it('positive - should return true, when experiment can continue', async () => {
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

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      try {
        const stopConditionType = service.stopConditionType;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
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
      expect(service.userID).toBeNull();
    });
  });
});
