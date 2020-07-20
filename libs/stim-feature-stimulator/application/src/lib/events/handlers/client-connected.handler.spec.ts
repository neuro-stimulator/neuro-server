import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

import { ClientConnectedEvent, SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { queryBusProvider, commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { ClientConnectedHandler } from './client-connected.handler';
import { StimulatorConnectionStateMessage, StimulatorDataStateMessage } from '@stechy1/diplomka-share';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

describe('ClientConnectedHandler', () => {
  let testingModule: TestingModule;
  let handler: ClientConnectedHandler;
  let facade: MockType<SocketFacade>;
  let queryBusMock: MockType<QueryBus>;
  let commandBusMock: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ClientConnectedHandler,
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

    handler = testingModule.get<ClientConnectedHandler>(ClientConnectedHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<SocketFacade>>(SocketFacade);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should send connection information about stimulator and state to client', async () => {
    const connected = true;
    const stateData = new StimulatorStateData(Buffer.from([0, 0, 0, 0, 0, 0]), 0);
    const clientID = '1';
    const event = new ClientConnectedEvent(clientID);

    queryBusMock.execute.mockReturnValue(connected);
    commandBusMock.execute.mockReturnValue(stateData);

    await handler.handle(event);

    expect(facade.sendCommand.mock.calls[0]).toEqual([clientID, new StimulatorConnectionStateMessage(connected)]);
    expect(facade.sendCommand.mock.calls[1]).toEqual([clientID, new StimulatorDataStateMessage(stateData.state)]);
  });

  it('positive - should send connection information about stimulator to client', async () => {
    const connected = false;
    const clientID = '1';
    const event = new ClientConnectedEvent(clientID);

    queryBusMock.execute.mockReturnValue(connected);

    await handler.handle(event);

    expect(facade.sendCommand.mock.calls.length).toBe(1);
    expect(facade.sendCommand.mock.calls[0]).toEqual([clientID, new StimulatorConnectionStateMessage(connected)]);
  });
});
