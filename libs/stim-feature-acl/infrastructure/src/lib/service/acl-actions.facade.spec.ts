import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';

import { AclAction } from '@stechy1/diplomka-share';

import { queryBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclActionsFacade } from './acl-actions.facade';

describe('AclActionsFacade', () => {
  let testingModule: TestingModule;
  let facade: AclActionsFacade;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AclActionsFacade, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AclActionsFacade>(AclActionsFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('positive - should call query GetAllAclActionsQuery', () => {
    const actions: AclAction[] = [];

    queryBus.execute.mockReturnValueOnce(actions);

    return expect(facade.getActions()).resolves.toEqual(actions);
  });
});
