import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { SeedCommand, TruncateCommand } from '@diplomka-backend/stim-feature-seed/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SeedFacade } from './seed.facade';

describe('SeedFacade', () => {
  let testingModule: TestingModule;
  let commandBus: MockType<CommandBus>;
  let facade: SeedFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SeedFacade, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    facade = testingModule.get<SeedFacade>(SeedFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('seed()', async () => {
    await facade.seed();

    expect(commandBus.execute).toBeCalledWith(new SeedCommand());
  });
  it('truncate()', async () => {
    await facade.truncate();

    expect(commandBus.execute).toBeCalledWith(new TruncateCommand());
  });
});
