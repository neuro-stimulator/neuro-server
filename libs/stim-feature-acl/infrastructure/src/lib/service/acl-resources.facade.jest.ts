import { MockType } from 'test-helpers/test-helpers';

import { AclResourcesFacade } from './acl-resources.facade';

export const createAclResourcesFacadeMock: () => MockType<AclResourcesFacade> = jest.fn(() => ({
  getResources: jest.fn(),
}));
