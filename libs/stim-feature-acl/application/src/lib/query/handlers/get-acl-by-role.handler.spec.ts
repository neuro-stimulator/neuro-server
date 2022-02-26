import { Test, TestingModule } from '@nestjs/testing';

import { Acl } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from '../../service/acl.service';
import { createAclServiceMock } from '../../service/acl.service.jest';
import { GetAclByRoleQuery } from '../impl/get-acl-by-role.query';

import { GetAclByRoleHandler } from './get-acl-by-role.handler';

describe('GetAclByRoleHandler', () => {
  let testingModule: TestingModule;
  let handler: GetAclByRoleHandler;
  let service: MockType<AclService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetAclByRoleHandler,
        {
          provide: AclService,
          useFactory: createAclServiceMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetAclByRoleHandler>(GetAclByRoleHandler);
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
    const roles: number[] = [1, 2];
    const acl: Acl[] = [];
    const query = new GetAclByRoleQuery(roles);

    service.aclByRoles.mockReturnValueOnce(acl);

    expect(handler.execute(query)).resolves.toEqual(acl);
    expect(service.aclByRoles).toBeCalledWith(roles);
  });
});
