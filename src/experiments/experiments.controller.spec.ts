import { ExperimentsController } from './experiments.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentsService } from './experiments.service';
import { Repository } from 'typeorm';
import { ExperimentEntity } from './entity/experiment.entity';

describe('User Controller', () => {
  let testingModule: TestingModule;
  let controller: ExperimentsController;
  let experimentsService: ExperimentsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentsController],
      providers: [
        // {
        //   provide: ExperimentsService,
        //   useFactory: () => ({
        //     findAll: jest.fn(() => true),
        //     byId: jest.fn(() => true),
        //     insert: jest.fn(() => true),
        //     update: jest.fn(() => true),
        //     delete: jest.fn(() => true),
        //     usedOutputMultimedia: jest.fn(() => true),
        //   }),
        // },
        // {
        //   provide: Repository<ExperimentEntity>,
        //   useFactory: () => ({
        //
        //   })
        // }
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
