import { Test, TestingModule } from '@nestjs/testing';

import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentAlreadyInitializedException,
  ExperimentEndCondition,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-player/domain';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let testingModule: TestingModule;
  let service: PlayerService;
  let experiment: Experiment;
  let experimentEndCondition: ExperimentEndCondition;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    service = testingModule.get<PlayerService>(PlayerService);

    experiment = createEmptyExperiment();
    experiment.id = 1;
    experiment.name = 'test';
    experimentEndCondition = { canContinue: jest.fn().mockReturnValue(true) };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('activeExperimentResult', () => {
    it('positive - should create new active experiment result', () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      const expected: ExperimentResult = createEmptyExperimentResult(experiment);
      expected.date = service.activeExperimentResult.date;

      expect(service.activeExperimentResult).toEqual(expected);
    });

    it('positive - should clear active experiment result', (done: DoneCallback) => {
      try {
        const emptyResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ExperimentResultIsNotInitializedException);
      }

      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);
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
        const experimentResult = service.activeExperimentResult;
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
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      try {
        service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);
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

  describe('pushResultData()', () => {
    const data: IOEvent = { name: 'ioEvent', index: 0, ioType: 'input', state: 'on', timestamp: 0 };

    it('positive - should push result data to collection', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

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

  describe('activeExperimentResultData()', () => {
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

  describe('experimentResultData()', () => {
    it('positive - should return experiment result data', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

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

  describe('nextExperimentRound()', () => {
    it('positive - should return zero when experiment result is initialized', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      const firstRound = service.experimentRound;

      expect(firstRound).toBe(0);
    });

    it('positive - should increase experiment round', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);
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

  describe('experimentRepeat()', () => {
    it('positive - should set experiment repeat before experiment is initialized', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.experimentRepeat).toBe(experimentRepeat);
    });
  });

  describe('canExperimentContinue()', () => {
    it('positive - should return true, when experiment can continue', async () => {
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.canExperimentContinue).toEqual(true);
    });

    it('positive - should return false, when experiment can not continue', async () => {
      experimentEndCondition = { canContinue: jest.fn().mockReturnValue(false) };
      const experimentRepeat = 1;
      const betweenExperimentInterval = 1;
      service.createEmptyExperimentResult(experiment, experimentEndCondition, experimentRepeat, betweenExperimentInterval);

      expect(service.canExperimentContinue).toEqual(false);
    });

    it('negative - should thow exception when experiment result is not initialized', async (done: DoneCallback) => {
      Object.defineProperty(service, 'canExperimentContinue', {
        get: jest.fn(() => {
          throw new ExperimentResultIsNotInitializedException();
        }),
      });

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
});
