import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { IOEvent } from '@stechy1/diplomka-share';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentIsNotInitializedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';
import { AppendExperimentResultDataHandler } from './append-experiment-result-data.handler';

describe('AppendExperimentResultDataHandler', () => {
  let testingModule: TestingModule;
  let handler: AppendExperimentResultDataHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AppendExperimentResultDataHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<AppendExperimentResultDataHandler>(AppendExperimentResultDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.pushResultData.mockClear();
  });

  it('positive - should append result data', async () => {
    const resultDataPart: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const command = new AppendExperimentResultDataCommand(resultDataPart);

    await handler.execute(command);

    expect(service.pushResultData).toBeCalledWith(resultDataPart);
  });

  it('negative - should throw exception when no experiment is running', async (done: DoneCallback) => {
    const resultDataPart: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const command = new AppendExperimentResultDataCommand(resultDataPart);

    service.pushResultData.mockImplementation(() => {
      throw new ExperimentIsNotInitializedException();
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentIsNotInitializedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentIsNotInitializedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
