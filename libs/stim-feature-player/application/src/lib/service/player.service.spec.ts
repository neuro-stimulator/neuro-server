import { Test, TestingModule } from '@nestjs/testing';

import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentAlreadyInitializedException,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-player/domain';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let testingModule: TestingModule;
  let service: PlayerService;
  let experiment: Experiment;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    service = testingModule.get<PlayerService>(PlayerService);

    experiment = createEmptyExperiment();
    experiment.id = 1;
    experiment.name = 'test';
  });

  describe('activeExperimentResult', () => {
    it('positive - should create new active experiment result', () => {
      service.createEmptyExperimentResult(experiment);

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

      service.createEmptyExperimentResult(experiment);
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
      service.createEmptyExperimentResult(experiment);

      try {
        service.createEmptyExperimentResult(experiment);
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
      service.createEmptyExperimentResult(experiment);

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
      service.createEmptyExperimentResult(experiment);

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
      service.createEmptyExperimentResult(experiment);

      const firstRound = service.experimentRound;

      expect(firstRound).toBe(0);
    });

    it('positive - should increase experiment round', async () => {
      service.createEmptyExperimentResult(experiment);
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
      const repeat = 1;

      service.experimentRepeat = repeat;

      expect(service.experimentRepeat).toBe(repeat);
    });

    it('negative - should not set experiment repeat when experiment is already initialized', async (done: DoneCallback) => {
      service.createEmptyExperimentResult(experiment);

      try {
        service.experimentRepeat = 1;
        done.fail('ExperimentAlreadyInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentAlreadyInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
