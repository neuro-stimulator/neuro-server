import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeedCommand } from '../../command/impl/seed.command';

import { SeedApplicationReadyHandler } from './seed-application-ready.handler';

describe('SeedApplicationReadyHandler', () => {
  let testingModule: TestingModule;
  let handler: SeedApplicationReadyHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SeedApplicationReadyHandler, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SeedApplicationReadyHandler>(SeedApplicationReadyHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call seed command', async () => {
    process.env.SETUP_SEED_DATABASE = 'true';
    const event = new ApplicationReadyEvent();

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new SeedCommand());
  });

  it('positive - should not call seed command', async () => {
    delete process.env['SETUP_SEED_DATABASE'];
    const event = new ApplicationReadyEvent();

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });

  it('negative - database seed can fail without throwing any error', async () => {
    process.env.SETUP_SEED_DATABASE = 'true';
    const event = new ApplicationReadyEvent();

    commandBus.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    await handler.handle(event);

    // selhání seedování se (zatím) nijak neřeší, pouze se zaloguje
    expect(true).toBeTruthy();
  })
});
