import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';
import { ExperimentResultIsNotInitializedException } from '@diplomka-backend/stim-feature-player/domain';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerService } from '../../service/player.service';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';
import { FillInitialIoDataHandler } from './fill-initial-io-data.handler';

describe('FillInitialIoDataHandler', () => {
  let testingModule: TestingModule;
  let handler: FillInitialIoDataHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FillInitialIoDataHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<FillInitialIoDataHandler>(FillInitialIoDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
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

    expect(commandBus.execute).toBeCalledTimes(experimentResult.outputCount * 2);
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
