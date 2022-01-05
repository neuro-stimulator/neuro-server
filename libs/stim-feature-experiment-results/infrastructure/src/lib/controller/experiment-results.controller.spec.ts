import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, MessageCodes, Output, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException, ValidationErrors } from '@neuro-server/stim-lib-common';
import {
  ExperimentResultIdNotFoundException,
  ExperimentResultWasNotUpdatedException,
  ExperimentResultNotValidException,
  ExperimentResultWasNotDeletedException,
} from '@neuro-server/stim-feature-experiment-results/domain';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsFacade } from '../service/experiment-results.facade';
import { createExperimentResultsFacadeMock } from '../service/experiment-results.facade.jest';
import { ExperimentResultsController } from './experiment-results.controller';

describe('Experiment results controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentResultsController;
  let mockExperimentResultsFacade: MockType<ExperimentResultsFacade>;
  let experiment: Experiment<Output>;

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
    testingModule.useLogger(new NoOpLogger());

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
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultsAll.mockReturnValue(experimentResults);

      const result: ResponseObject<ExperimentResult[]> = await controller.all(userGroups);
      const expected: ResponseObject<ExperimentResult[]> = { data: experimentResults };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', () => {
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultsAll.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.all(userGroups)).rejects.toThrow(new ControllerException());
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
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);
      mockExperimentResultsFacade.validate.mockReturnValue(true);

      const result: ResponseObject<ExperimentResult> = await controller.experimentResultById({ id: experimentResult.id }, userGroups);
      const expected: ResponseObject<ExperimentResult> = { data: experimentResult };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment result not found', () => {
      const experimentID = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultByID.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentID);
      });

      expect(() => controller.experimentResultById({ id: experimentID }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, { id: experimentID}));
    });

    it('negative - should throw an exception when unknown error', () => {
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultByID.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.experimentResultById({ id: 1 }, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('update()', () => {
    it('positive - should update experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const userGroups = [1];

      mockExperimentResultsFacade.update.mockReturnValue(true);
      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);

      const result: ResponseObject<ExperimentResult> = await controller.update(experimentResult, userGroups);
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

    it('positive - should return same experiment result because update is not necessary', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const userGroups = [1];

      mockExperimentResultsFacade.update.mockReturnValue(false);
      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);

      const result: ResponseObject<ExperimentResult> = await controller.update(experimentResult, userGroups);
      const expected: ResponseObject<ExperimentResult> = {
        data: experimentResult,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_RESULT_UPDATE_NOT_NECESSARY,
          params: {
            id: experimentResult.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should return error code when experiment result not found', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResult.id);
      });

      expect(() => controller.update(experimentResult, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, { id: experimentResult.id }));
    });

    it('negative - should not update experiment result because of problem with update', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultWasNotUpdatedException(experimentResult);
      });

      expect(() => controller.update(experimentResult, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_UPDATED, { id: experimentResult.id }));
    });

    it('negative - should not update experiment result when unknown error', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.validate.mockReturnValue(true);
      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.update(experimentResult, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not update invalid experiment result', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];
      const errors: ValidationErrors = [];

      mockExperimentResultsFacade.update.mockImplementation(() => {
        throw new ExperimentResultNotValidException(experimentResult, errors);
      });

      expect(() => controller.update(experimentResult, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_VALID, { errors }));
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.experimentResultByID.mockReturnValue(experimentResult);

      const result: ResponseObject<ExperimentResult> = await controller.delete(
        {
          id: experimentResult.id,
        },
        userGroups
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

    it('negative - should not delete experiment result which is not found', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResult.id);
      });

      expect(() => controller .delete({ id: experimentResult.id }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, { id: experimentResult.id }));
    });

    it('negative - should not delete experiment result because of problem with delete', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new ExperimentResultWasNotDeletedException(experimentResult.id);
      });

      expect(() => controller .delete({ id: experimentResult.id }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_DELETED));
        });

    it('negative - should not delete experiment result because of unknown problem with delete', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const userGroups = [1];

      mockExperimentResultsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller .delete({ id: experimentResult.id }, userGroups)).rejects.toThrow(new ControllerException());
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

    it('negative - should return error code when experiment result not found', () => {
      const experimentResultID = 1;

      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new ExperimentResultIdNotFoundException(experimentResultID);
      });

      // @ts-ignore
      expect(() => controller.resultData({ id: 1 }, responseMock))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND, { id: 1}));
    });

    it('negative - should return error code when experiment result data file not found', () => {
      const experimentResultID = 1;

      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new FileNotFoundException('path');
      });

      // @ts-ignore
      expect(() => controller.resultData({ id: 1 }, responseMock))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND, { path: 'path' }));
    });

    it('negative - should not return any result data when unknown error', () => {
      mockExperimentResultsFacade.resultData.mockImplementation(() => {
        throw new Error();
      });

      // @ts-ignore
      expect(() => controller.resultData({ id: 1 }, responseMock))
      .rejects.toThrow(new ControllerException());
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

    it('negative - should throw exception with invalid parameters', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
      const errors: ValidationErrors = [];

      mockExperimentResultsFacade.validate.mockImplementationOnce(() => {
        throw new ExperimentResultNotValidException(experimentResult, errors);
      });

      expect(() => controller.validate(experimentResult))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_VALID, { errors }));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());

      mockExperimentResultsFacade.validate.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.validate(experimentResult))
      .rejects.toThrow(new ControllerException());
    });
  });
});
