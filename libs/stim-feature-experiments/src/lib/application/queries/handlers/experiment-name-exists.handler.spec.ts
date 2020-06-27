import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { createExperimentsServiceMock } from '../../../domain/services/experiments.service.jest';
import { ExperimentNameExistsQuery } from '../impl/experiment-name-exists.query';
import { ExperimentNameExistsHandler } from './experiment-name-exists.handler';

describe('ExperimentNameExistsHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentNameExistsHandler;
  let service: MockType<ExperimentsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentNameExistsHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<ExperimentNameExistsHandler>(ExperimentNameExistsHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
  });

  it('positive - experiment name does not exists', async () => {
    const name = 'test';
    const experimentID = 1;
    const query = new ExperimentNameExistsQuery(name, experimentID);

    service.nameExists.mockReturnValue(false);

    const result = await handler.execute(query);

    expect(result).toBeFalsy();
  });

  it('negative - experiment name exists', async () => {
    const name = 'test';
    const experimentID = 1;
    const query = new ExperimentNameExistsQuery(name, experimentID);

    service.nameExists.mockReturnValue(true);

    const result = await handler.execute(query);

    expect(result).toBeTruthy();
  });
});
