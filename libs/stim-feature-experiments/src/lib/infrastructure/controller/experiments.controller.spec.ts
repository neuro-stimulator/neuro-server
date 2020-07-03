import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { createEmptyExperiment, Experiment, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';

import { ExperimentIdNotFoundError } from '../../domain/exception/experiment-id-not-found.error';
import { ExperimentWasNotCreatedError } from '../../domain/exception/experiment-was-not-created.error';
import { ExperimentWasNotUpdatedError } from '../../domain/exception/experiment-was-not-updated.error';
import { ExperimentNotValidException } from '../../domain/exception/experiment-not-valid.exception';
import { ExperimentWasNotDeletedError } from '../../domain/exception/experiment-was-not-deleted.error';
import { createExperimentsFacadeMock } from '../service/experiments.facade.jest';
import { ExperimentsFacade } from '../service/experiments.facade';
import { ExperimentsController } from './experiments.controller';

describe('Experiments controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentsController;
  let mockExperimentsFacade: MockType<ExperimentsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentsController],
      providers: [
        {
          provide: ExperimentsFacade,
          useFactory: createExperimentsFacadeMock,
        },
      ],
    }).compile();
    controller = testingModule.get(ExperimentsController);
    // @ts-ignore
    mockExperimentsFacade = testingModule.get<MockType<ExperimentsFacade>>(ExperimentsFacade);
  });

  afterEach(() => {
    mockExperimentsFacade.experimentsAll.mockClear();
    mockExperimentsFacade.filteredExperiments.mockClear();
    mockExperimentsFacade.experimentByID.mockClear();
    mockExperimentsFacade.validate.mockClear();
    mockExperimentsFacade.insert.mockClear();
    mockExperimentsFacade.update.mockClear();
    mockExperimentsFacade.delete.mockClear();
    mockExperimentsFacade.usedOutputMultimedia.mockClear();
    mockExperimentsFacade.nameExists.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all experiments', async () => {
      const experiments = new Array(5).fill(0).map(() => createEmptyExperiment());

      mockExperimentsFacade.experimentsAll.mockReturnValue(experiments);

      const result: ResponseObject<Experiment[]> = await controller.all();
      const expected: ResponseObject<Experiment[]> = { data: experiments };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', async (done: DoneCallback) => {
      mockExperimentsFacade.experimentsAll.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .all()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of an experiment', async () => {
      mockExperimentsFacade.nameExists.mockReturnValue(false);

      const result: ResponseObject<{
        exists: boolean;
      }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: false },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should check name existence of an experiment', async () => {
      mockExperimentsFacade.nameExists.mockReturnValue(true);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: true },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('experimentById()', () => {
    it('positive - should find experiment by id', async () => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.experimentById({ id: experiment.id });
      const expected: ResponseObject<Experiment> = { data: experiment };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new ExperimentIdNotFoundError(experimentID);
      });

      controller
        .experimentById({ id: experimentID })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentID });
          done();
        });
    });

    it('negative - should throw an exception when unknown error', async (done: DoneCallback) => {
      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new Error();
      });

      controller
        .experimentById({ id: 1 })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockReturnValue(1);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.insert(experiment);
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not insert invalid experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockReturnValue(experiment);

      // TODO vymyslet jak ošetřit nevalidní experiment
    });

    it('negative - should not insert when query error', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentWasNotCreatedError(experiment);
      });

      await controller
        .insert(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_CREATED);
          done();
        });
    });

    it('negative - should not insert experiment when unknown error', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .insert(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('update()', () => {
    it('positive - should update experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.update(experiment);
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not update experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentIdNotFoundError(experiment.id);
      });

      await controller
        .update(experiment)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not update experiment because of problem with update', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentWasNotUpdatedError(experiment);
      });

      await controller
        .update(experiment)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_UPDATED);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not update experiment when unknown error', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .update(experiment)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not update invalid experiment', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment);
      });

      await controller
        .update(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.delete({
        id: 1,
      });
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not delete experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentIdNotFoundError(experiment.id);
      });

      await controller
        .delete({ id: experiment.id })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not delete experiment when unknown error', async (done: DoneCallback) => {
      const id = 1;
      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .delete({ id })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  it('negative - should not delete experiment because of problem with delete', async (done: DoneCallback) => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    mockExperimentsFacade.validate.mockReturnValue(true);
    mockExperimentsFacade.delete.mockImplementation(() => {
      throw new ExperimentWasNotDeletedError(experiment.id);
    });

    await controller
      .delete({ id: experiment.id })
      .then(() => {
        done.fail();
      })
      .catch((exception: ControllerException) => {
        expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_DELETED);
        expect(exception.params).toEqual({ id: experiment.id });
        done();
      });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should return used output multimedia for experiment', async () => {
      const multimedia: { audio: {}; image: {} } = { audio: {}, image: {} };
      mockExperimentsFacade.usedOutputMultimedia.mockReturnValue(multimedia);

      const result: ResponseObject<{
        audio: {};
        image: {};
      }> = await controller.usedOutputMultimedia({ id: 1 });
      const expected: ResponseObject<{ audio: {}; image: {} }> = {
        data: multimedia,
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not return any output multimedia for experiment which is not found', async (done: DoneCallback) => {
      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new ExperimentIdNotFoundError(1);
      });

      await controller
        .usedOutputMultimedia({ id: 1 })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: 1 });
          done();
        });
    });

    it('negative - should not return any output multimedia for experiment when unknown error', async (done: DoneCallback) => {
      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .usedOutputMultimedia({ id: 1 })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });
});
