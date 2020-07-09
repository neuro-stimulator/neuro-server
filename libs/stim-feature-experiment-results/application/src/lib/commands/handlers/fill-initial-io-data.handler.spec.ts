import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentResultIsNotInitializedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';
import { FillInitialIoDataHandler } from './fill-initial-io-data.handler';

describe('FillInitialIoDataHandler', () => {
  let testingModule: TestingModule;
  let handler: FillInitialIoDataHandler;
  let service: MockType<ExperimentResultsService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FillInitialIoDataHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<FillInitialIoDataHandler>(FillInitialIoDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    service.delete.mockClear();
    commandBus.execute.mockClear();
  });

  it('positive - should fill initial io data', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.outputCount = 8;
    const timestamp = 1;
    const command = new FillInitialIoDataCommand(timestamp);

    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => experimentResult),
    });

    await handler.execute(command);

    // expect(commandBus.execute).toBeCalledWith(new AppendExperimentResultDataCommand(null));
    expect(commandBus.execute).toBeCalledTimes(experimentResult.outputCount);
  });

  it('negative - should throw exception when experiment result is not initialized', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.outputCount = 8;
    const timestamp = 1;
    const command = new FillInitialIoDataCommand(timestamp);

    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => {
        throw new ExperimentResultIsNotInitializedException();
      }),
    });
    // service.activeExperimentResult.mockImplementation(() => {
    //   throw new ExperimentResultIsNotInitializedException();
    // });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultIsNotInitializedException exception was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultIsNotInitializedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
