import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentByIdQuery } from '../impl/experiment-by-id.query';
import { ExperimentByIdHandler } from './experiment-by-id.handler';

describe('ExperimentByIdHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentByIdHandler;
  let service: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentByIdHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentByIdHandler>(ExperimentByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should find experiment by id', async () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const query = new ExperimentByIdQuery(experiment.id, userID);

    service.byId.mockReturnValue(experiment);

    const result = await handler.execute(query);

    expect(result).toEqual(experiment);
  });

  it('negative - should throw exception when experiment not found', () => {
    const experimentID = -1;
    const userID = 0;
    const query = new ExperimentByIdQuery(-1, userID);

    service.byId.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new ExperimentIdNotFoundException(experimentID));
  });
});
