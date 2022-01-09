import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { AclResource } from '@stechy1/diplomka-share';

import { queryBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclResourcesFacade } from './acl-resources.facade';

describe('AclResourcesFacade', () => {
  let testingModule: TestingModule;
  let facade: AclResourcesFacade;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AclResourcesFacade, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AclResourcesFacade>(AclResourcesFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('positive - should call query GetAllAclResourcesQuery', () => {
    const aclResources: AclResource[] = [];

    queryBus.execute.mockReturnValueOnce(aclResources);

    return expect(facade.getResources()).resolves.toEqual(aclResources);
  });
});
