import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, Experiment, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ExperimentsController } from './experiments.controller';
import { ExperimentsService } from './experiments.service';
import { MockType } from '../test-helpers';
import { ControllerException } from '../controller-exception';

export const createExperimentsServiceMock: () => MockType<ExperimentsService> = jest.fn(() => ({
  findAll: jest.fn(),
  byId: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  usedOutputMultimedia: jest.fn(),
  validateExperiment: jest.fn(),
  nameExists: jest.fn(),
  registerMessagePublisher: jest.fn(),
  publishMessage: jest.fn()
}));

describe('Experiments controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentsController;
  let mockExperimentsService: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentsController],
      providers: [
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock
        }
      ],
    }).compile();
    controller = testingModule.get(ExperimentsController);
    // @ts-ignore
    mockExperimentsService = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all experiments', async () => {
      const experiments = new Array(5).fill(0).map(() => createEmptyExperiment());
      mockExperimentsService.findAll.mockReturnValue(experiments);

      const result: ResponseObject<Experiment[]> = await controller.all();
      const expected: ResponseObject<Experiment[]> = { data: experiments };

      expect(result).toEqual(expected);
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of an experiment', async () => {
      mockExperimentsService.nameExists.mockReturnValue(true);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = { data: {  exists: true } };

      expect(result).toEqual(expected);
    });

    it('negative - should check name existence of an experiment', async () => {
      mockExperimentsService.nameExists.mockReturnValue(false);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = { data: {  exists: false } };

      expect(result).toEqual(expected);
    });
  });

  describe('experimentById()', () => {
    it('positive - should find experiment by id', async () => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsService.byId.mockReturnValue(experiment);
      mockExperimentsService.validateExperiment.mockReturnValue(true);

      const result: ResponseObject<Experiment> = await controller.experimentById({ id: 1 });
      const expected: ResponseObject<Experiment> = { data: experiment };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      mockExperimentsService.byId.mockReturnValue(undefined);

      controller.experimentById({  id: 1 })
                .then(() => {
                  done.fail();
                })
                .catch((exception: ControllerException) => {
                  expect(exception.code).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
                  expect(exception.params).toEqual({ id: 1 });
                  done();
                });
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.insert.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.insert(experiment);
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
          params: {
            id: experiment.id
          }
        }
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not insert invalid experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.insert.mockReturnValue(experiment);

      // TODO vymyslet jak ošetřit nevalidní experiment
    });
  });

  describe('update()', () => {
    it('positive - should update experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.update.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.update(experiment);
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
          params: {
            id: experiment.id
          }
        }
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not update experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.update.mockReturnValue(undefined);

      await controller.update(experiment)
                .then(() => {
                  done.fail();
                })
                .catch((exception: ControllerException) => {
                  expect(exception.code).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
                  expect(exception.params).toEqual({ id: experiment.id });
                  done();
                });
    });

    it('negative - should not update invalid experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.update.mockReturnValue(experiment);

      // TODO vymyslet jak ošetřit nevalidní experiment
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      mockExperimentsService.delete.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.delete({ id: 1 });
      const expected: ResponseObject<Experiment> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
          params: {
            id: experiment.id
          }
        }
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not delete experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsService.validateExperiment.mockReturnValue(true);
      mockExperimentsService.delete.mockReturnValue(undefined);

      await controller.delete( { id: experiment.id })
                .then(() => {
                  done.fail();
                })
                .catch((exception: ControllerException) => {
                  expect(exception.code).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
                  expect(exception.params).toEqual({ id: experiment.id });
                  done();
                });
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should return used output multimedia for experiment', async () => {
      const multimedia: {audio: {}, image: {}} = { audio: {}, image: {} };
      mockExperimentsService.usedOutputMultimedia.mockReturnValue(multimedia);

      const result: ResponseObject<{ audio: {}, image: {} }> = await controller.usedOutputMultimedia( { id: 1 });
      const expected: ResponseObject<{ audio: {}, image: {} }> = { data: multimedia };

      expect(result).toEqual(expected);
    });

    it('negative - should not return any output multimedia for experiment which is not found', async (done: DoneCallback) => {
      mockExperimentsService.usedOutputMultimedia.mockReturnValue(undefined);

      await controller.usedOutputMultimedia({ id: 1 })
                      .then(() => {
                        done.fail();
                      })
                      .catch((exception: ControllerException) => {
                        expect(exception.code).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
                        expect(exception.params).toEqual({ id: 1 });
                        done();
                      });
    });
  });
});
