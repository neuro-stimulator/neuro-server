import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentFindOptions, ExperimentOptionalFindOptions } from '@neuro-server/stim-feature-experiments/domain';

import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentsAllQuery } from '../impl/experiments-all.query';
import { ExperimentsAllHandler } from './experiments-all.handler';

describe('ExperimentsAllHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentsAllHandler;
  let service: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentsAllHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentsAllHandler>(ExperimentsAllHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should get all experiments', async () => {
    const experiments: Experiment<Output>[] = [createEmptyExperiment()];
    const userGroups = [1];
    const optionalOptions: ExperimentOptionalFindOptions = {};
    const query = new ExperimentsAllQuery(userGroups, optionalOptions);

    service.findAll.mockReturnValue(experiments);

    const result = await handler.execute(query);

    expect(result).toEqual(experiments);
    expect(service.findAll).toBeCalledWith<ExperimentFindOptions[]>({ userGroups, optionalOptions } );
  });
});
