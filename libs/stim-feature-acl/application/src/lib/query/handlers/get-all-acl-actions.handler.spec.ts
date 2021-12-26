import { Test, TestingModule } from '@nestjs/testing';

import { AclAction } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAllAclActionsHandler } from './get-all-acl-actions.handler';
import { GetAllAclActionsQuery } from '../impl/get-all-acl-actions.query';

describe('GetAllAclActionsHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAllAclActionsHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAllAclActionsHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAllAclActionsHandler>(GetAllAclActionsHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl actions', () => {
    const aclActions: AclAction[] = [];
    const query = new GetAllAclActionsQuery();

    service.getActions.mockReturnValueOnce(aclActions);

    expect(handler.execute(query)).resolves.toEqual(aclActions);
  });
});
