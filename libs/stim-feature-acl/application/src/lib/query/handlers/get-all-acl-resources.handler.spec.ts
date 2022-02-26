import { Test, TestingModule } from '@nestjs/testing';

import { AclPossession } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAllAclResourcesQuery } from '../impl/get-all-acl-resources.query';

import { GetAllAclResourcesHandler } from './get-all-acl-resources.handler';

describe('GetAllAclResourcesHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAllAclResourcesHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAllAclResourcesHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAllAclResourcesHandler>(GetAllAclResourcesHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl resources', () => {
    const aclPossessions: AclPossession[] = [];
    const query = new GetAllAclResourcesQuery();

    service.getResources.mockReturnValueOnce(aclPossessions);

    expect(handler.execute(query)).resolves.toEqual(aclPossessions);
  });
});
