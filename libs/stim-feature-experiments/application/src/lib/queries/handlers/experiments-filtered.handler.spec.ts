import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentsFilteredQuery } from '../impl/experiments-filtered.query';
import { ExperimentsFilteredHandler } from './experiments-filtered.handler';

describe('ExperimentsFilteredHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentsFilteredHandler;
  let service: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentsFilteredHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<ExperimentsFilteredHandler>(ExperimentsFilteredHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - should get all experiments', async () => {
    const experiments: Experiment[] = [createEmptyExperiment()];
    const filter = {};
    const userID = 0;
    const query = new ExperimentsFilteredQuery(filter, userID);

    service.findAll.mockReturnValue(experiments);

    const result = await handler.execute(query);

    expect(result).toEqual(experiments);
    expect(service.findAll).toBeCalledWith({ where: { userId: userID } });
  });
});
