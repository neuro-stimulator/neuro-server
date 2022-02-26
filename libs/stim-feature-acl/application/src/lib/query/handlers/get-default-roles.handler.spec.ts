import { Test, TestingModule } from '@nestjs/testing';

import { AclRole } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetDefaultRolesQuery } from '../impl/get-default-roles.query';

import { GetDefaultRolesHandler } from './get-default-roles.handler';

describe('GetDefaultRolesHandler', () => {
  let testingModule: TestingModule;
  let handler: GetDefaultRolesHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetDefaultRolesHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetDefaultRolesHandler>(GetDefaultRolesHandler);
    // @ts-ignore
    service = testingModule.get<MockType<AclService>>(AclService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should get all acl by defined roles', () => {
    const aclRoles: AclRole[] = [];
    const query = new GetDefaultRolesQuery();

    service.getDefaultRoles.mockReturnValueOnce(aclRoles);

    expect(handler.execute(query)).resolves.toEqual(aclRoles);
  });
});
