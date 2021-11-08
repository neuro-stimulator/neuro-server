import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentResultCreatedMessage } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { SendExperimentResultCreatedToClientCommand } from '../../impl/to-client/send-experiment-result-created-to-client.command';
import { SendExperimentResultCreatedToClientHandler } from './send-experiment-result-created-to-client.handler';

describe('SendExperimentResultCreatedToClientHandler', () => {
  let testingModule: TestingModule;
  let handler: SendExperimentResultCreatedToClientHandler;
  let facade: MockType<SocketFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SendExperimentResultCreatedToClientHandler,
        {
          provide: SocketFacade,
          useFactory: jest.fn(() => ({
            broadcastCommand: jest.fn(),
          })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SendExperimentResultCreatedToClientHandler>(SendExperimentResultCreatedToClientHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
  });

  afterEach(() => {
    facade.broadcastCommand.mockClear();
  });

  it('positive - should execute command to broadcast experiment result created message', async () => {
    const experimentResultID = 1;
    const command = new SendExperimentResultCreatedToClientCommand(experimentResultID);

    await handler.execute(command);

    expect(facade.broadcastCommand).toBeCalledWith(new ExperimentResultCreatedMessage(command.experimentResultID));
  });
});
