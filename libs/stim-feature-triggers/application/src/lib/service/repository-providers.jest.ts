import { Provider } from '@nestjs/common';

import { TriggerControlEntity, TriggersRepository } from '@diplomka-backend/stim-feature-triggers/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

export const repositoryTriggersEntityMock: RepositoryMockType<TriggerControlEntity> = createRepositoryMock();
export const helperEntityManager = {
  getRepository: () => repositoryTriggersEntityMock,
  query: jest.fn(),
};

export const triggersRepositoryProvider: Provider = {
  provide: TriggersRepository,
  // @ts-ignore
  useValue: new TriggersRepository(helperEntityManager),
};
