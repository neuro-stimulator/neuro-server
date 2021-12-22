import { Acl, AclAction, AclPossession, AclResource, AclRole } from '@stechy1/diplomka-share';

import { AclEntity } from '../model/entity/acl.entity';
import { AclRoleEntity } from '../model/entity/acl-role.entity';
import { AclResourceEntity } from '../model/entity/acl-resource.entity';
import { AclActionEntity } from '../model/entity/acl-action.entity';
import { AclPossessionEntity } from '../model/entity/acl-possession.entity';

export function entityToAcl(entity: AclEntity): Acl {
  return {
    id: entity.id,
    role: entity.role.role,
    resource: entity.resource.resource,
    attributes: entity.attributes,
    action: entity.action.action,
    possession: entity.possession.possession
  }
}

export function aclToEntity(acl: Acl): AclEntity {
  const entity = new AclEntity();

  entity.id = acl.id;
  entity.role = new AclRoleEntity();
  entity.resource = new AclResourceEntity();
  entity.action = new AclActionEntity();
  entity.possession = new AclPossessionEntity();
  entity.attributes = acl.attributes;

  entity.role.role = acl.role;
  entity.resource.resource = acl.resource;
  entity.action.action = acl.action;
  entity.possession.possession = acl.possession;

  return entity;
}

export function entityToAclRole(entity: AclRoleEntity): AclRole {
  return {
    id: entity.id,
    role: entity.role,
    isDefault: entity.isDefault
  };
}

export function aclRoleToEntity(aclRole: AclRole): AclRoleEntity {
  const entity = new AclRoleEntity();

  entity.id = aclRole.id;
  entity.role = aclRole.role;
  entity.isDefault = aclRole.isDefault;

  return entity;
}

export function entityToAclPossession(entity: AclPossessionEntity): AclPossession {
  return {
    id: entity.id,
    possession: entity.possession,
  };
}

export function aclPossessionToEntity(aclPossession: AclPossession): AclPossessionEntity {
  const entity = new AclPossessionEntity();

  entity.id = aclPossession.id;
  entity.possession = aclPossession.possession;

  return entity;
}

export function entityToAclAction(entity: AclActionEntity): AclAction {
  return {
    id: entity.id,
    action: entity.action,
  };
}

export function aclActionToEntity(aclAction: AclAction): AclActionEntity {
  const entity = new AclActionEntity();

  entity.id = aclAction.id;
  entity.action = aclAction.action;

  return entity;
}

export function entityToAclResource(entity: AclResourceEntity): AclResource {
  return {
    id: entity.id,
    resource: entity.resource,
  };
}

export function aclResourceToEntity(aclResource: AclResource): AclResourceEntity {
  const entity = new AclResourceEntity();

  entity.id = aclResource.id;
  entity.resource = aclResource.resource;

  return entity;
}
