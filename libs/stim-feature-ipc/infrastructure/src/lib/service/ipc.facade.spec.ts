import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcFacade } from './ipc.facade';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IpcCloseCommand, IpcOpenCommand, IsIpcConnectedQuery } from '@diplomka-backend/stim-feature-ipc/application';

describe('IpcFacade', () => {
  let testingModule: TestingModule;
  let facade: IpcFacade;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcFacade, commandBusProvider, queryBusProvider],
    }).compile();

    facade = testingModule.get<IpcFacade>(IpcFacade);
    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call IsConnected()', async () => {
    await facade.isConnected();

    expect(queryBusMock.execute).toBeCalledWith(new IsIpcConnectedQuery());
  });

  it('positive - should call Open()', async () => {
    await facade.open();

    expect(commandBusMock.execute).toBeCalledWith(new IpcOpenCommand());
  });

  it('positive - should call Close()', async () => {
    await facade.close();

    expect(commandBusMock.execute).toBeCalledWith(new IpcCloseCommand());
  });
});
