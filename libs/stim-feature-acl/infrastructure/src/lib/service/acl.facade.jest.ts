import { MockType } from 'test-helpers/test-helpers';

import { AclFacade } from './acl.facade';

export const createAclFacadeMock: () => MockType<AclFacade> = jest.fn(() => ({
  getAcl: jest.fn(),
  updateAcl: jest.fn(),
  insertAcl: jest.fn(),
  deleteAcl: jest.fn(),
}));
