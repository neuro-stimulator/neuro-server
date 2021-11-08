import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';
import { DTOs } from '@neuro-server/stim-feature-experiments/domain';

import { RegisterDtoCommand } from '../../commands/impl/register-dto.command';
import { ExperimentsApplicationReadyHandler } from './experiments-application-ready.handler';

describe('ExperimentsApplicationReadyHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentsApplicationReadyHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ExperimentsApplicationReadyHandler, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentsApplicationReadyHandler>(ExperimentsApplicationReadyHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should call command to register DTOs', async () => {
    const event = new ApplicationReadyEvent();

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new RegisterDtoCommand(DTOs));
  });
});
