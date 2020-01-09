import { ExperimentsController } from '../../src/experiments/experiments.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentsService } from '../../src/experiments/experiments.service';
import { ExperimentRepository } from '../../src/experiments/repository/experiment.repository';

describe('Experiments controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentsController;
  let experimentsService: ExperimentsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentsController],
      providers: [
        {
          provide: ExperimentsService,
          useFactory: () => ({
            findAll: jest.fn(() => true),
            byId: jest.fn(() => true),
            insert: jest.fn(() => true),
            update: jest.fn(() => true),
            delete: jest.fn(() => true),
            usedOutputMultimedia: jest.fn(() => true),
          }),
        },
        {
          provide: ExperimentRepository,
          useFactory: () => ({
            all: jest.fn(() => true),
            one: jest.fn(() => true),
            insert: jest.fn(() => true),
            update: jest.fn(() => true),
            delete: jest.fn(() => true),
          })
        }
      ],
    }).compile();
    controller = testingModule.get(ExperimentsController);
    experimentsService = testingModule.get(ExperimentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all', () => {
    it('should return all experiments', async () => {
      await controller.all();
      expect(experimentsService.findAll).toHaveBeenCalled();
    });
  });
});
