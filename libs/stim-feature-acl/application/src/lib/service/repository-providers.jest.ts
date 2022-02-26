import { EntityTarget } from 'typeorm';

import { Provider } from '@nestjs/common';

import { AclActionEntity, AclEntity, AclPossessionEntity, AclRepository, AclResourceEntity, AclRoleEntity } from '@neuro-server/stim-feature-acl/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

export const repositoryAclEntityMock: RepositoryMockType<AclEntity> = createRepositoryMock();
export const repositoryAclActionEntityMock: RepositoryMockType<AclActionEntity> = createRepositoryMock();
export const repositoryAclPossessionEntityMock: RepositoryMockType<AclPossessionEntity> = createRepositoryMock();
export const repositoryAclRoleEntityMock: RepositoryMockType<AclRoleEntity> = createRepositoryMock();
export const repositoryAclResourceEntityMock: RepositoryMockType<AclResourceEntity> = createRepositoryMock();

export const aclRepositoryProvider: Provider = {
  provide: AclRepository,
  useValue: new AclRepository({
    // @ts-ignore
    getRepository: (entity: EntityTarget<any>) => {
      switch (entity) {
        case AclEntity:
          return repositoryAclEntityMock;
        case AclActionEntity:
          return repositoryAclActionEntityMock
        case AclPossessionEntity:
          return repositoryAclPossessionEntityMock;
        case AclRoleEntity:
          return repositoryAclRoleEntityMock;
        case AclResourceEntity:
          return repositoryAclResourceEntityMock;
        default:
          throw new Error('Unknown entity mapping!')
      }
    }
  })
};
