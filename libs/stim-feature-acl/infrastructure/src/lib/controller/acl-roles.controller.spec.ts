import { Test, TestingModule } from '@nestjs/testing';

import { AclRole } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclRolesFacade } from '../service/acl-roles.facade';
import { createAclRolesFacadeMock } from '../service/acl-roles.facade.jest';
import { AclRolesController } from './acl-roles.controller';

describe('AclRolesController', () => {
  let testingModule: TestingModule;
  let controller: AclRolesController;
  let facade: MockType<AclRolesFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AclRolesController],
      providers: [
        {
          provide: AclRolesFacade,
          useFactory: createAclRolesFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<AclRolesController>(AclRolesController);
    // @ts-ignore
    facade = testingModule.get<MockType<AclRolesFacade>>(AclRolesFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('positive - should get all acl roles', () => {
    const aclRoles: AclRole[] = [];

    facade.getRoles.mockReturnValueOnce(aclRoles);

    return expect(controller.getRoles()).resolves.toEqual(aclRoles);
  });
});
