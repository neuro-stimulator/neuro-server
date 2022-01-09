import { MockType } from 'test-helpers/test-helpers';

import { AclRolesFacade } from './acl-roles.facade';

export const createAclRolesFacadeMock: () => MockType<AclRolesFacade> = jest.fn(() => ({
  getRoles: jest.fn(),
}));
