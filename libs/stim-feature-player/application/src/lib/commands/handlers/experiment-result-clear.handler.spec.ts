import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerService } from '../../service/player.service';
import { ExperimentResultClearCommand } from '../impl/experiment-result-clear.command';
import { ExperimentResultClearHandler } from './experiment-result-clear.handler';

describe('ExperimentResultClearHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultClearHandler;
  let service: MockType<PlayerService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultClearHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultClearHandler>(ExperimentResultClearHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
  });

  it('positive - should clear experiment result', async () => {
    const command = new ExperimentResultClearCommand();

    await handler.execute(command);

    expect(service.clearRunningExperimentResult).toBeCalled();
  });
});
