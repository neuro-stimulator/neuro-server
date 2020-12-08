import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { IpcOutputSynchronizationUpdatedEvent, IpcSetOutputSynchronizationCommand } from '@diplomka-backend/stim-feature-ipc/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SendAssetConfigurationToIpcCommand } from '../../commands/impl/to-ipc/send-asset-configuration-to-ipc.command';
import { IpcOutputSynchronizationUpdatedHandler } from './ipc-output-synchronization-updated.handler';

describe('IpcOutputSynchronizationUpdatedHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcOutputSynchronizationUpdatedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcOutputSynchronizationUpdatedHandler, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcOutputSynchronizationUpdatedHandler>(IpcOutputSynchronizationUpdatedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should not call command bus, when synchronization is disabled', async () => {
    const synchronize = false;
    const event = new IpcOutputSynchronizationUpdatedEvent(synchronize);

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });

  it('positive - should send asset configuration to ipc when synchronization is enabled and experimentID is available', async () => {
    const synchronize = true;
    const userID = 1;
    const experimentID = 1;
    const event = new IpcOutputSynchronizationUpdatedEvent(synchronize, userID, experimentID);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new SendAssetConfigurationToIpcCommand(userID, experimentID));
    expect(commandBus.execute).not.toBeCalledWith(new IpcSetOutputSynchronizationCommand(false));
  });

  it('negative - should disable synchronization when synchronization is enabled, but experimentID is not available', async () => {
    const synchronize = true;
    const userID = 1;
    const experimentID = undefined;
    const event = new IpcOutputSynchronizationUpdatedEvent(synchronize, userID, experimentID);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new IpcSetOutputSynchronizationCommand(false));
    expect(commandBus.execute).not.toBeCalledWith(new SendAssetConfigurationToIpcCommand(userID, experimentID));
  });
});
