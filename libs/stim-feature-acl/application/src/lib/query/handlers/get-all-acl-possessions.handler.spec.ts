import { Test, TestingModule } from '@nestjs/testing';

import { AclPossession } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAllAclPossessionsHandler } from './get-all-acl-possessions.handler';
import { GetAllAclPossessionsQuery } from '../impl/get-all-acl-possessions.query';

describe('GetAllAclPossessionsHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAllAclPossessionsHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAllAclPossessionsHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAllAclPossessionsHandler>(GetAllAclPossessionsHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl possessions', () => {
    const aclPossessions: AclPossession[] = [];
    const query = new GetAllAclPossessionsQuery();

    service.getPossessions.mockReturnValueOnce(aclPossessions);

    expect(handler.execute(query)).resolves.toEqual(aclPossessions);
  });
});
