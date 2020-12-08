import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage, StimulatorConnectionStateMessage, StimulatorDataStateMessage } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ClientConnectionReadyEvent, SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { ConnectionClientReadyHandler } from './connection-client-ready.handler';

describe('ConnectionClientConnectedHandler', () => {
  let testingModule: TestingModule;
  let handler: ConnectionClientReadyHandler;
  let facade: MockType<SocketFacade>;
  let queryBusMock: MockType<QueryBus>;
  let commandBusMock: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ConnectionClientReadyHandler,
        {
          provide: SocketFacade,
          useFactory: jest.fn(() => ({
            sendCommand: jest.fn(),
          })),
        },

        queryBusProvider,
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ConnectionClientReadyHandler>(ConnectionClientReadyHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should send connection information about stimulator, ipc and stimulator state to client', async () => {
    const stimulatorConnected: ConnectionStatus = ConnectionStatus.CONNECTED;
    const ipcConnected: ConnectionStatus = ConnectionStatus.CONNECTED;
    const stateData = new StimulatorStateData(Buffer.from([0, 0, 0, 0, 0, 0]), 0);
    const clientID = '1';
    const event = new ClientConnectionReadyEvent(clientID);

    queryBusMock.execute.mockReturnValueOnce(stimulatorConnected);
    queryBusMock.execute.mockReturnValueOnce(ipcConnected);
    commandBusMock.execute.mockReturnValue(stateData);

    await handler.handle(event);

    expect(facade.sendCommand.mock.calls[0]).toEqual([clientID, new StimulatorConnectionStateMessage(stimulatorConnected)]);
    expect(facade.sendCommand.mock.calls[1]).toEqual([clientID, new IpcConnectionStateMessage(ipcConnected)]);
    expect(facade.sendCommand.mock.calls[2]).toEqual([clientID, new StimulatorDataStateMessage(stateData.state)]);
  });

  it('positive - should send connection information about stimulator to client', async () => {
    const connected: ConnectionStatus = ConnectionStatus.DISCONNECTED;
    const clientID = '1';
    const event = new ClientConnectionReadyEvent(clientID);

    queryBusMock.execute.mockReturnValue(connected);

    await handler.handle(event);

    expect(facade.sendCommand.mock.calls.length).toBe(2);
    expect(facade.sendCommand.mock.calls[0]).toEqual([clientID, new StimulatorConnectionStateMessage(connected)]);
  });
});
