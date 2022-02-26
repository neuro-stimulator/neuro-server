import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentToggleOutputSynchronizationMessage, MessageCodes } from '@stechy1/diplomka-share';

import { IpcDisconnectedEvent } from '@neuro-server/stim-feature-ipc/application';
import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentIpcDisconnectedHandler } from './experiment-ipc-disconnected.handler';

describe('ExperimentIpcDisconnectedHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentIpcDisconnectedHandler;
  let facade: MockType<SocketFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentIpcDisconnectedHandler,
        {
          provide: SocketFacade,
          useValue: {
            broadcastCommand: jest.fn(),
          },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentIpcDisconnectedHandler>(ExperimentIpcDisconnectedHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
  });

  it('positive - should broadcast message', async () => {
    const clientID = 'clientID';
    const event = new IpcDisconnectedEvent(clientID);

    await handler.handle(event);

    expect(facade.broadcastCommand).toBeCalledWith(
      new ExperimentToggleOutputSynchronizationMessage(false, { code: MessageCodes.CODE_ERROR_EXPERIMENT_OUTPUT_SYNCHRONIZATION_DISABLED })
    );
  });
});
