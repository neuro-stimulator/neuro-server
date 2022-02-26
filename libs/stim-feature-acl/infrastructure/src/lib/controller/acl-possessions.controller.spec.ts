import { Test, TestingModule } from '@nestjs/testing';

import { AclPossession } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclPossessionsFacade } from '../service/acl-possessions.facade';
import { createAclPossessionsFacadeMock } from '../service/acl-possessions.facade.jest';

import { AclPossessionsController } from './acl-possessions.controller';

describe('AclPossessionsController', () => {
  let testingModule: TestingModule;
  let controller: AclPossessionsController;
  let facade: MockType<AclPossessionsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AclPossessionsController],
      providers: [
        {
          provide: AclPossessionsFacade,
          useFactory: createAclPossessionsFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<AclPossessionsController>(AclPossessionsController);
    // @ts-ignore
    facade = testingModule.get<MockType<AclPossessionsFacade>>(AclPossessionsFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('positive - should get all acl possessions', () => {
    const aclPossessions: AclPossession[] = [];

    facade.getPossessions.mockReturnValueOnce(aclPossessions);

    return expect(controller.getPossessions()).resolves.toEqual(aclPossessions);
  });
});
