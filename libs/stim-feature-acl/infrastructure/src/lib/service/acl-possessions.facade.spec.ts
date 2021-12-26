import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { AclPossession } from '@stechy1/diplomka-share';

import { queryBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclPossessionsFacade } from './acl-possessions.facade';

describe('AclPossessionsFacade', () => {
  let testingModule: TestingModule;
  let facade: AclPossessionsFacade;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AclPossessionsFacade, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AclPossessionsFacade>(AclPossessionsFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('positive - should call query GetAllAclPossessionsQuery', () => {
    const aclPossessions: AclPossession[] = [];

    queryBus.execute.mockReturnValueOnce(aclPossessions);

    return expect(facade.getPossessions()).resolves.toEqual(aclPossessions);
  });
});
