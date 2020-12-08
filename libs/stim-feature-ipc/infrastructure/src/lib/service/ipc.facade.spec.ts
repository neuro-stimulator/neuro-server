import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { IpcCloseCommand, IpcOpenCommand, IpcConnectionStatusQuery, IpcSpawnCommand, IpcKillCommand } from '@diplomka-backend/stim-feature-ipc/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcFacade } from './ipc.facade';

describe('IpcFacade', () => {
  let testingModule: TestingModule;
  let facade: IpcFacade;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<IpcFacade>(IpcFacade);
    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call status()', async () => {
    await facade.status();

    expect(queryBusMock.execute).toBeCalledWith(new IpcConnectionStatusQuery());
  });

  it('positive - should call spawn()', async () => {
    await facade.spawn();

    expect(commandBusMock.execute).toBeCalledWith(new IpcSpawnCommand());
  });

  it('positive - should call kill()', async () => {
    await facade.kill();

    expect(commandBusMock.execute).toBeCalledWith(new IpcKillCommand());
  });

  it('positive - should call open()', async () => {
    await facade.open();

    expect(commandBusMock.execute).toBeCalledWith(new IpcOpenCommand());
  });

  it('positive - should call close()', async () => {
    await facade.close();

    expect(commandBusMock.execute).toBeCalledWith(new IpcCloseCommand());
  });
});
