import { Repository } from 'typeorm';
import { Provider } from '@nestjs/common';

import { TriggerControlEntity, TriggersRepository } from '@diplomka-backend/stim-feature-triggers/domain';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

export const repositoryTriggersEntityMock: MockType<Repository<TriggerControlEntity>> = createRepositoryMock();
export const helperEntityManager = {
  getRepository: () => repositoryTriggersEntityMock,
  query: jest.fn(),
};

export const triggersRepositoryProvider: Provider = {
  provide: TriggersRepository,
  // @ts-ignore
  useValue: new TriggersRepository(helperEntityManager),
};
