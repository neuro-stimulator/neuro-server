import { Test, TestingModule } from '@nestjs/testing';

import { AclResource } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclResourcesFacade } from '../service/acl-resources.facade';
import { createAclResourcesFacadeMock } from '../service/acl-resources.facade.jest';
import { AclResourcesController } from './acl-resources.controller';

describe('AclResourcesController', () => {
  let testingModule: TestingModule;
  let controller: AclResourcesController;
  let facade: MockType<AclResourcesFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AclResourcesController],
      providers: [
        {
          provide: AclResourcesFacade,
          useFactory: createAclResourcesFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<AclResourcesController>(AclResourcesController);
    // @ts-ignore
    facade = testingModule.get<MockType<AclResourcesFacade>>(AclResourcesFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('positive - should get all acl resources', () => {
    const aclResources: AclResource[] = [];

    facade.getResources.mockReturnValueOnce(aclResources);

    return expect(controller.getResources()).resolves.toEqual(aclResources);
  });
});
