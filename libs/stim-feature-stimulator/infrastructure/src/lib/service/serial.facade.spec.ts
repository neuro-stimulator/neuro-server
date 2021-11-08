import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { CloseCommand, DiscoverQuery, GetStimulatorConnectionStatusQuery, OpenCommand } from '@neuro-server/stim-feature-stimulator/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { SerialFacade } from './serial.facade';

describe('SerialController', () => {
  let testingModule: TestingModule;
  let facade: SerialFacade;
  let commandBus: MockType<CommandBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SerialFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());
    facade = testingModule.get(SerialFacade);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('discover', () => {
    it('should call ', async () => {
      await facade.discover();

      expect(queryBus.execute).toBeCalledWith(new DiscoverQuery());
    });
  });

  describe('open', () => {
    it('should call ', async () => {
      const path = 'path';

      await facade.open(path);

      expect(commandBus.execute).toBeCalledWith(new OpenCommand(path));
    });
  });

  describe('close', () => {
    it('should call ', async () => {
      await facade.close();

      expect(commandBus.execute).toBeCalledWith(new CloseCommand());
    });
  });

  describe('status', () => {
    it('should call ', async () => {
      await facade.status();

      expect(queryBus.execute).toBeCalledWith(new GetStimulatorConnectionStatusQuery());
    });
  });
});
