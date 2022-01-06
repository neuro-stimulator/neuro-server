import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { StimulatorStateCommand } from '../../commands/impl/stimulator-state.command';
import { SendStimulatorStateChangeToClientCommand } from '../../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { SerialOpenEvent } from '../impl/serial-open.event';
import { SerialOpenHandler } from './serial-open.handler';

describe('SerialOpenHandler', () => {
  let testingModule: TestingModule;
  let handler: SerialOpenHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SerialOpenHandler,
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SerialOpenHandler>(SerialOpenHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call stimulator state command', async () => {
    const serilPath = 'virtual';
    const event: SerialOpenEvent = new SerialOpenEvent(serilPath);
    const state = 0;
    const stateData: StimulatorStateData = { state, name: 'StimulatorStateData', noUpdate: false, timestamp: 123456 };

    commandBus.execute.mockReturnValueOnce(stateData);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new StimulatorStateCommand(true));
    expect(commandBus.execute).toBeCalledWith(new SendStimulatorStateChangeToClientCommand(state));
  });

  it('negative - should catch exception when communication error', async () => {
    const serilPath = 'virtual';
    const event: SerialOpenEvent = new SerialOpenEvent(serilPath);

    commandBus.execute.mockImplementationOnce(() => {
      throw new Error('timeout');
    })

    await handler.handle(event);
  });
});
