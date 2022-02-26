import { Test, TestingModule } from '@nestjs/testing';

import { AclAction } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclActionsFacade } from '../service/acl-actions.facade';
import { createAclActionsFacadeMock } from '../service/acl-actions.facade.jest';

import { AclActionsController } from './acl-actions.controller';

describe('AclActionsController', () => {
  let testingModule: TestingModule;
  let controller: AclActionsController;
  let facade: MockType<AclActionsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AclActionsController],
      providers: [
        {
          provide: AclActionsFacade,
          useFactory: createAclActionsFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<AclActionsController>(AclActionsController);
    // @ts-ignore
    facade = testingModule.get<MockType<AclActionsFacade>>(AclActionsFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('positive - should get all acl actions', () => {
    const aclActions: AclAction[] = [];

    facade.getActions.mockReturnValueOnce(aclActions);

    return expect(controller.getActions()).resolves.toEqual(aclActions);
  });
});
