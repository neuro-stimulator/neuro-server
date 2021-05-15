import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { SocketMessage, SocketMessageSpecialization, SocketMessageType } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SendCommand } from '../../application/commands/impl/send.command';
import { BroadcastCommand } from '../../application/commands/impl/broadcast.command';

describe('SocketFacade', () => {
  let testingModule: TestingModule;
  let commandBus: MockType<CommandBus>;
  let facade: SocketFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SocketFacade, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    facade = testingModule.get<SocketFacade>(SocketFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sendCommand()', async () => {
    const clientID = 'clientID';
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };

    await facade.sendCommand(clientID, message);

    expect(commandBus.execute).toBeCalledWith(new SendCommand(clientID, message));
  });
  it('broadcastCommand()', async () => {
    const message: SocketMessage = {
      type: SocketMessageType.CLIENT_READY,
      specialization: SocketMessageSpecialization.CLIENT,
      data: 'some random data'
    };

    await facade.broadcastCommand(message);

    expect(commandBus.execute).toBeCalledWith(new BroadcastCommand(message));
  });
});
