import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';

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

    handler = testingModule.get<ExperimentByIdHandler>(ExperimentByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should find experiment by id', async () => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const query = new ExperimentByIdQuery(experiment.id);

    service.byId.mockReturnValue(experiment);

    const result = await handler.execute(query);

    expect(result).toEqual(experiment);
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experimentID = -1;
    const query = new ExperimentByIdQuery(-1);

    service.byId.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'ExperimentIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
