import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcSetPublicPathCommand } from '../../commands/impl/ipc-set-public-path.command';
import { IpcConnectedEvent } from '../impl/ipc-connected.event';
import { IpcConnectedHandler } from './ipc-connected.handler';

describe('IpcConnectedHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcConnectedHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcConnectedHandler, queryBusProvider, commandBusProvider],
    }).compile();

    handler = testingModule.get<IpcConnectedHandler>(IpcConnectedHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should handle connected event', async () => {
    const clientID = 'clientID';
    const publicPath = 'test/path';
    const event = new IpcConnectedEvent(clientID);

    queryBus.execute.mockReturnValue(publicPath);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new IpcSetPublicPathCommand(publicPath));
  });
});
