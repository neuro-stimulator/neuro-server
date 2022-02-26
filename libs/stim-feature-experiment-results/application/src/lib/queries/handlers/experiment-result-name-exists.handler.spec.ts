import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultNameExistsQuery } from '../impl/experiment-result-name-exists.query';

import { ExperimentResultNameExistsHandler } from './experiment-result-name-exists.handler';

describe('ExperimentResultNameExistsHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultNameExistsHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultNameExistsHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultNameExistsHandler>(ExperimentResultNameExistsHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.nameExists.mockClear();
  });

  it('positive - experiment result name does not exists', async () => {
    const name = 'test';
    const experimentResultID = 1;
    const query = new ExperimentResultNameExistsQuery(name, experimentResultID);

    service.nameExists.mockReturnValue(false);

    const result = await handler.execute(query);

    expect(result).toBeFalsy();
  });

  it('negative - experiment result name exists', async () => {
    const name = 'test';
    const experimentResultID = 1;
    const query = new ExperimentResultNameExistsQuery(name, experimentResultID);

    service.nameExists.mockReturnValue(true);

    const result = await handler.execute(query);

    expect(result).toBeTruthy();
  });
});
