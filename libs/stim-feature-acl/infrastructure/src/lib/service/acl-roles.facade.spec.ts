import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { AclRole } from '@stechy1/diplomka-share';

import { queryBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclRolesFacade } from './acl-roles.facade';

describe('AclRolesFacade', () => {
  let testingModule: TestingModule;
  let facade: AclRolesFacade;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AclRolesFacade, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AclRolesFacade>(AclRolesFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('positive - should call query GetAllAclRolesQuery', () => {
    const aclRoles: AclRole[] = [];

    queryBus.execute.mockReturnValueOnce(aclRoles);

    return expect(facade.getRoles()).resolves.toEqual(aclRoles);
  });
});
