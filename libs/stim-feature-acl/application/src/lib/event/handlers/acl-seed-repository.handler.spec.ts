import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AclEntity } from '@neuro-server/stim-feature-acl/domain';
import { SeedRepositoryEvent } from '@neuro-server/stim-feature-seed/application';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { AclSeedRepositoryHandler } from './acl-seed-repository.handler';

describe('AclSeedRepositoryHandler', () => {

  let testingModule: TestingModule;
  let handler: AclSeedRepositoryHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclSeedRepositoryHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<AclSeedRepositoryHandler>(AclSeedRepositoryHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - reload acl from entities', async () => {
    const entityType: Type<unknown> = AclEntity;
    const entities: AclEntity[] = [];
    const event = new SeedRepositoryEvent(entityType, entities);

    await handler.handle(event);

    expect(service.reloadAclFromEntities).toBeCalledWith(entities);
  });

  it('negative - should not reload acl when not AclEntity', async () => {
    const entityType: Type<unknown> = Object;
    const entities: Object[] = [];
    const event = new SeedRepositoryEvent(entityType, entities);

    await handler.handle(event);

    expect(service.reloadAclFromEntities).not.toBeCalledWith(entities);
  });
});
