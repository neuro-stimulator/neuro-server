import { Test, TestingModule } from '@nestjs/testing';

import { SocketMessageSpecialization } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { CreateNewExperimentRoundToClientCommand } from '../../impl/to-client/create-new-experiment-round-to-client.command';
import { CreateNewExperimentRoundToClientHandler } from './create-new-experiment-round-to-client.handler';

describe('CreateNewExperimentRoundToClientHandler', () => {
  let testingModule: TestingModule;
  let handler: CreateNewExperimentRoundToClientHandler;
  let socketFacade: MockType<SocketFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        CreateNewExperimentRoundToClientHandler,
        {
          provide: SocketFacade,
          useValue: { broadcastCommand: jest.fn() },
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<CreateNewExperimentRoundToClientHandler>(CreateNewExperimentRoundToClientHandler);
    // @ts-ignore
    socketFacade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should send command for new experiment round to client', async () => {
    const command = new CreateNewExperimentRoundToClientCommand();

    await handler.execute(command);

    expect(socketFacade.broadcastCommand).toBeCalledWith({
      specialization: SocketMessageSpecialization.EXPERIMENT_PLAYER,
      type: 99,
      data: {},
    });
  });
});
