import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultClearHandler } from './experiment-result-clear.handler';
import { ExperimentResultClearCommand } from '@diplomka-backend/stim-feature-experiment-results/application';

describe('ExperimentResultClearHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultClearHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultClearHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultClearHandler>(ExperimentResultClearHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  it('positive - should clear experiment result', async () => {
    const command = new ExperimentResultClearCommand();

    await handler.execute(command);

    expect(service.clearRunningExperimentResult).toBeCalled();
  });
});
