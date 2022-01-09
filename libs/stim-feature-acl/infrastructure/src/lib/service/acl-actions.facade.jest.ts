import { MockType } from 'test-helpers/test-helpers';

import { AclActionsFacade } from './acl-actions.facade';

export const createAclActionsFacadeMock: () => MockType<AclActionsFacade> = jest.fn(() => ({
  getActions: jest.fn(),
}));
