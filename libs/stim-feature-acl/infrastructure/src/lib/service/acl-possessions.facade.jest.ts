import { MockType } from 'test-helpers/test-helpers';

import { AclPossessionsFacade } from './acl-possessions.facade';

export const createAclPossessionsFacadeMock: () => MockType<AclPossessionsFacade> = jest.fn(() => ({
  getPossessions: jest.fn(),
}));
