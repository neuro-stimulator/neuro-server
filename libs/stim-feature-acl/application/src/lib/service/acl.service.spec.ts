import { Test, TestingModule } from '@nestjs/testing';
import { AccessControl, IQueryInfo, Permission } from 'accesscontrol';

import { Acl, AclRole, createEmptyAcl, createEmptyAclRole } from '@stechy1/diplomka-share';

import { ACCESS_CONTROL_TOKEN, AclEntity, AclRoleEntity, aclRoleToEntity, aclToEntity } from '@neuro-server/stim-feature-acl/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { AclService } from './acl.service';
import { createAccessControlMock } from './acl.service.jest';
import { aclRepositoryProvider, repositoryAclEntityMock, repositoryAclRoleEntityMock } from './repository-providers.jest';
import { createMock } from '@golevelup/ts-jest';

describe('AclService', () => {

  let testingModule: TestingModule;
  let service: AclService;
  let acc: MockType<AccessControl>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AclService,
        aclRepositoryProvider,
        {
          provide: ACCESS_CONTROL_TOKEN,
          useFactory: createAccessControlMock
        },
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<AclService>(AclService);
    // @ts-ignore
    acc = testingModule.get<MockType<AccessControl>>(ACCESS_CONTROL_TOKEN);
  })

  it('positive - should be definde', () => {
    expect(service).toBeDefined();
  });

  describe('reloadAcl()', () => {
    it('positive - should call setGrants on ACC instance', () => {

      const acl: Acl[] = [
        {
          id: 1,
          resource: 'resource',
          role: 'role',
          possession: 'possession',
          action: 'action',
          attributes: '*'
        }
      ]

      service.reloadAcl(acl);

      expect(acc.setGrants).toBeCalledWith([
        {
          role: 'role',
          resource: 'resource',
          action: 'action:possession',
          attributes: ['*']
        }
      ]);
    });
  });

  describe('getPermission()', () => {
    it('positive - should return permission', () => {
      const queryInfo: IQueryInfo = {};
      const permission: Permission = createMock<Permission>();

      acc.permission.mockReturnValueOnce(permission);

      expect(service.getPermission(queryInfo)).toEqual(permission);
    })
  })

  describe('aclByRoles()', () => {
    it('positive - should return acl by roles', () => {
      const roles: number[] = [1, 2];
      const acl: Acl[] = [createEmptyAcl()];
      const aclEntities: AclEntity[] = [aclToEntity(createEmptyAcl())];

      repositoryAclEntityMock.find.mockReturnValueOnce(aclEntities);

      expect(service.aclByRoles(roles)).resolves.toEqual(acl);
    })
  })

  describe('getAllAcl()', () => {
    it('positive - should return all available ACL', () => {
      const acl: Acl[] = [createEmptyAcl()];
      const aclEntities: AclEntity[] = [aclToEntity(createEmptyAcl())];

      repositoryAclEntityMock.find.mockReturnValueOnce(aclEntities);

      expect(service.getAllAcl()).resolves.toEqual(acl);
    })
  })

  describe('getDefaultRoles()', () => {
    it('positive - should return all default roles', () => {
      const roles: AclRole[] = [createEmptyAclRole()];
      const rolesEntities: AclRoleEntity[] = [aclRoleToEntity(createEmptyAclRole())];

      repositoryAclRoleEntityMock.find.mockReturnValueOnce(rolesEntities);

      expect(service.getDefaultRoles()).resolves.toEqual(roles);
    });
  });
});
