import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;
import { Response } from 'express';

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException, ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';
import {
  ExperimentResultIdNotFoundException,
  ExperimentResultWasNotUpdatedException,
  ExperimentResultNotValidException,
  ExperimentResultWasNotDeletedException,
} from '@diplomka-backend/stim-feature-experiment-results/domain';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsFacade } from '../service/experiment-results.facade';
import { createExperimentResultsFacadeMock } from '../service/experiment-results.facade.jest';
import { ExperimentResultsController } from './experiment-results.controller';

describe('Experiment results controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentResultsController;
  let mockExperimentResultsFacade: MockType<ExperimentResultsFacade>;
  let experiment: Experiment;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentResultsController],
      providers: [
        {
          provide: ExperimentResultsFacade,
          useFactory: createExperimentResultsFacadeMock,
        },
      ],
    }).compile();

    controller = testingModule.get<ExperimentResultsController>(ExperimentResultsController);
    // @ts-ignore
    mockExperimentResultsFacade = testingModule.get<MockType<ExperimentResultsFacade>>(ExperimentResultsFacade);

    experiment = createEmptyExperiment();
    experiment.id = 1;
  });

  afterEach(() => {
    mockExperimentResultsFacade.experimentResultsAll.mockClear();
    mockExperimentResultsFacade.validate.mockClear();
    mockExperimentResultsFacade.experimentResultByID.mockClear();
    mockExperimentResultsFacade.resultData.mockClear();
    mockExperimentResultsFacade.update.mockClear();
    mockExperimentResultsFacade.delete.mockClear();
    mockExperimentResultsFacade.nameExists.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available experiment results', async () => {
      const experimentResults: ExperimentResult[] = new Array(5).fill(0).map(() => createEmptyExperimentResult(createEmptyExperiment()));
      const userID = 0;

      mockExperimentResultsFacade.experimentResultsAll.mockReturnValue(experimentResults);

      const result: ResponseObject<ExperimentResult[]> = await controller.all(userID);
      const expected: ResponseObject<ExperimentResult[]> = { data: experimentResults };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', async (done: DoneCallback) => {
      const userID = 0;

      mockExperimentResultsFacade.experimentResultsAll.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .all(userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of an experiment result', async () => {
      mockExperimentResultsFacade.nameExists.mockReturnValue(true);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 1 });
      const expected: ResponseObject<{ exists: boolean }> = { data: { exists: true } };

      expect(result).toEqual(expected);
    });

    it('negative - should check name existence of an experiment', async () => {
      mockExperimentResultsFacade.nameExists.mockReturnValue(false);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 1 });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: false },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('experimentResultById()', () => {
    it('positive - should return experiment by id', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);
      mockExperimentResultsFacade.validate.mockReturnValue(true);

      const result: ResponseObject<ExperimentResult> = await controller.experimentResultById({ id: experimentResult.id }, userID);
      const expected: ResponseObject<ExperimentResult> = { data: experimentResult };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment result not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;

      mockExperimentResultsFacade.experimentResultByID.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentID);
      });

      await controller
        .experimentResultById({ id: experimentID }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentID });
          done();
        });
    });

    it('negative - should throw an exception when unknown error', async (done: DoneCallback) => {
      const userID = 0;

      mockExperimentResultsFacade.experimentResultByID.mockImplementation(() => {
        throw new Error();
      });

      controller
        .experimentResultById({ id: 1 }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('update()', () => {
    it('positive - should update experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const userID = 0;

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);

      const result: ResponseObject<ExperimentResult> = await controller.update(experimentResult, userID);
      const expected: ResponseObject<ExperimentResult> = {
        data: experimentResult,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATED,
          params: {
            id: experimentResult.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResult.id);
      });

      await controller
        .update(experimentResult, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentResult.id });
          done();
        });
    });

    it('negative - should not update experiment result because of problem with update', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultWasNotUpdatedException(experimentResult);
      });

      await controller
        .update(experimentResult, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_UPDATED);
          expect(exception.params).toEqual({ id: experimentResult.id });
          done();
        });
    });

    it('negative - should not update experiment result when unknown error', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .update(experimentResult, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not update invalid experiment result', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;
      const errors: ValidationErrors = [];

      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultNotValidException(experimentResult, errors);
      });

      await controller
        .update(experimentResult, userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);

      const result: ResponseObject<ExperimentResult> = await controller.delete(
        {
          id: experimentResult.id,
        },
        userID
      );
      const expected: ResponseObject<ExperimentResult> = {
        data: experimentResult,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_DELETED,
          params: {
            id: experimentResult.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not delete experiment result which is not found', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResult.id);
      });

      await controller
        .delete({ id: experimentResult.id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentResult.id });
          done();
        });
    });

    it('negative - should not delete experiment result because of problem with delete', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new ExperimentResultWasNotDeletedException(experimentResult.id);
      });

      await controller
        .delete({ id: experimentResult.id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_DELETED);
          done();
        });
    });

    it('negative - should not delete experiment result because of unknown problem with delete', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userID = 0;

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .delete({ id: experimentResult.id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('resultData()', () => {
    let responseMock: MockType<Response>;

    beforeEach(() => {
      // @ts-ignore
      responseMock = {
        sendFile: jest.fn(),
        setHeader: jest.fn(),
        json: jest.fn(),
      };
    });

    it('positive - should return result data with file path', async () => {
      const experimentResultID = 1;
      const resultData = {};

      mockExperimentResultsFacade.resultData.mockReturnValue(resultData);

      // @ts-ignore
      const result = await controller.resultData({ id: experimentResultID }, responseMock);

      expect(result).toEqual(resultData);
    });

    it('negative - should return error code when experiment result not found', async (done: DoneCallback) => {
      const experimentResultID = 1;

      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResultID);
      });

      await controller
        // @ts-ignore
        .resultData({ id: 1 }, responseMock)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND);
          expect(exception.params).toEqual({ id: 1 });
          done();
        });
    });

    it('negative - should return error code when experiment result data file not found', async (done: DoneCallback) => {
      const experimentResultID = 1;

      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new FileNotFoundException('path');
      });

      await controller
        // @ts-ignore
        .resultData({ id: experimentResultID }, responseMock)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(exception.params).toEqual({ path: 'path' });
          done();
        });
    });

    it('negative - should not return any result data when unknown error', async (done: DoneCallback) => {
      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new Error();
      });

      await controller
        // @ts-ignore
        .resultData({ id: 1 }, responseMock)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('validate()', () => {
    it('positive - should return true when experiment is valid', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const valid = true;

      mockExperimentResultsFacade.validate.mockReturnValue(valid);

      const result: ResponseObject<boolean> = await controller.validate(experimentResult);
      const expected: ResponseObject<boolean> = { data: valid };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception with invalid parameters', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const errors: ValidationErrors = [];

      mockExperimentResultsFacade.validate.mockImplementationOnce(() => {
        throw new ExperimentResultNotValidException(experimentResult, errors);
      });

      await controller
        .validate(experimentResult)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });
  });
});
