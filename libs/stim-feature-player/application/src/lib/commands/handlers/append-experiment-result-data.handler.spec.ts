import { Test, TestingModule } from '@nestjs/testing';

import { IOEvent } from '@stechy1/diplomka-share';

import { ExperimentIsNotInitializedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerService } from '../../service/player.service';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';
import { AppendExperimentResultDataHandler } from './append-experiment-result-data.handler';

describe('AppendExperimentResultDataHandler', () => {
  let testingModule: TestingModule;
  let handler: AppendExperimentResultDataHandler;
  let service: MockType<PlayerService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AppendExperimentResultDataHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AppendExperimentResultDataHandler>(AppendExperimentResultDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
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

  it('negative - should throw exception when no experiment is running', () => {
    const resultDataPart: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const command = new AppendExperimentResultDataCommand(resultDataPart);

    service.pushResultData.mockImplementation(() => {
      throw new ExperimentIsNotInitializedException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentIsNotInitializedException());
  });
});
