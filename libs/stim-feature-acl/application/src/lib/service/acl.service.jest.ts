import { AccessControl } from 'accesscontrol';

import { MockType } from 'test-helpers/test-helpers';
import { AclService } from './acl.service';

export const createAccessControlMock: () => MockType<AccessControl> = jest.fn(() => ({
  getGrants: jest.fn(),
  setGrants: jest.fn(),
  reset: jest.fn(),
  lock: jest.fn(),
  extendRole: jest.fn(),
  removeRoles: jest.fn(),
  removeResources: jest.fn(),
  getRoles: jest.fn(),
  getInheritedRolesOf: jest.fn(),
  getExtendedRolesOf: jest.fn(),
  getResources: jest.fn(),
  hasRole: jest.fn(),
  hasResource: jest.fn(),
  can: jest.fn(),
  query: jest.fn(),
  permission: jest.fn(),
  grant: jest.fn(),
  allow: jest.fn(),
  deny: jest.fn(),
  reject: jest.fn()
}));

export const createAclServiceMock: () => MockType<AclService> = jest.fn(() => ({
  reloadAclFromEntities: jest.fn(),
  reloadAcl: jest.fn(),
  getPermission: jest.fn(),
  aclByRoles: jest.fn(),
  getAllAcl: jest.fn(),
  getDefaultRoles: jest.fn()
}));
