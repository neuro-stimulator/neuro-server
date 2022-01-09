import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

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
});
