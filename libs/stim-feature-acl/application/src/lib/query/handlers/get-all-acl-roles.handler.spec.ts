import { Test, TestingModule } from '@nestjs/testing';

import { AclRole } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAllAclRolesQuery } from '../impl/get-all-acl-roles.query';

import { GetAllAclRolesHandler } from './get-all-acl-roles.handler';

describe('GetAllAclRolesHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAllAclRolesHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAllAclRolesHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAllAclRolesHandler>(GetAllAclRolesHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl roles', () => {
    const aclRoles: AclRole[] = [];
    const query = new GetAllAclRolesQuery();

    service.getRoles.mockReturnValueOnce(aclRoles);

    expect(handler.execute(query)).resolves.toEqual(aclRoles);
  });
});
