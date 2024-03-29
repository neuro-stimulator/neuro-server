import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Acl } from '@stechy1/diplomka-share';

import { queryBusProvider, MockType, NoOpLogger, commandBusProvider } from 'test-helpers/test-helpers';

import { AclFacade } from './acl.facade';

describe('AclFacade', () => {
  let testingModule: TestingModule;
  let facade: AclFacade;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [AclFacade, queryBusProvider, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<AclFacade>(AclFacade);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('positive - should call query GetAllAclQuery', () => {
    const acl: Acl[] = [];

    queryBus.execute.mockReturnValueOnce(acl);

    return expect(facade.getAcl()).resolves.toEqual(acl);
  });

  it('positive - should call command AclUpdateCommand', () => {
    const acl: Acl = {};
    const aclId = 1;

    commandBus.execute.mockReturnValueOnce(aclId);

    return expect(facade.updateAcl(acl)).resolves.toEqual(aclId);
  });

  it('positive - should call command AclInsertCommand', () => {
    const acl: Acl = {};
    const aclId = 1;

    commandBus.execute.mockReturnValueOnce(aclId);

    return expect(facade.insertAcl(acl)).resolves.toEqual(aclId);
  });

  it('positive - should call command AclDeleteCommand', () => {
    const success = true;
    const aclId = 1;

    commandBus.execute.mockReturnValueOnce(success);

    return expect(facade.deleteAcl(aclId)).resolves.toEqual(success);
  });
});
