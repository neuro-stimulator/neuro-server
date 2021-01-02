import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { TriggersRepository } from '@diplomka-backend/stim-feature-triggers/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { TriggersService } from './triggers.service';
import { helperEntityManager, repositoryTriggersEntityMock, triggersRepositoryProvider } from './repository-providers.jest';

describe('TriggersService', () => {
  let testingModule: TestingModule;
  let service: TriggersService;
  let manager: MockType<EntityManager>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        TriggersService,
        triggersRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [TriggersRepository],
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<TriggersService>(TriggersService);
    // @ts-ignore
    manager = testingModule.get<MockType<EntityManager>>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeTriggers()', () => {
    it('positive - should initialize required triggers', async () => {
      const registeredTriggers = [];
      const triggers = ['trigger content 1', 'trigger content 2'];

      helperEntityManager.query.mockReturnValue(registeredTriggers);

      await service.initializeTriggers(triggers);

      expect(repositoryTriggersEntityMock.insert).toBeCalledTimes(triggers.length);
    });
  });

  describe('enable()', () => {
    it('positive - should enable trigger', async () => {
      const triggerName = 'triggerName';

      await service.enable(triggerName);

      expect(repositoryTriggersEntityMock.update).toBeCalledWith({ name: triggerName }, { enabled: true });
    });
  });
  describe('enableAll()', () => {
    it('positive - should enableAll triggers', async () => {
      await service.enableAll();

      expect(repositoryTriggersEntityMock.update).toBeCalledWith({}, { enabled: true });
    });
  });
  describe('disable()', () => {
    it('positive - should disable trigger', async () => {
      const triggerName = 'triggerName';

      await service.disable(triggerName);

      expect(repositoryTriggersEntityMock.update).toBeCalledWith({ name: triggerName }, { enabled: false });
    });
  });
  describe('disableAll()', () => {
    it('positive - should disableAll triggers', async () => {
      await service.disableAll();

      expect(repositoryTriggersEntityMock.update).toBeCalledWith({}, { enabled: false });
    });
  });
});
