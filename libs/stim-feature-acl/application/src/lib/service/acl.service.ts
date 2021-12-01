import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccessControl, IQueryInfo, Permission } from 'accesscontrol';

import { Acl, AclRole } from '@stechy1/diplomka-share';

import { ACCESS_CONTROL_TOKEN, AclEntity, AclRepository, aclToEntity } from '@neuro-server/stim-feature-acl/domain';

@Injectable()
export class AclService {

  private readonly logger: Logger = new Logger(AclService.name);

  constructor(@Inject(ACCESS_CONTROL_TOKEN) private readonly acl: AccessControl,
              private readonly repository: AclRepository) {
  }

  public reloadAclFromEntities(entities: AclEntity[]): void {
    this.logger.verbose('Obnovuji všechna ACL....')
    this.acl.setGrants(this.entitiesToGrants(entities));
  }

  public reloadAcl(acl: Acl[]): void {
    this.reloadAclFromEntities(acl.map((a: Acl) => aclToEntity(a)))
  }

  public getPermission(queryInfo: IQueryInfo): Permission {
    return this.acl.permission(queryInfo);
  }

  public aclByRoles(roles: number[]): Promise<Acl[]> {
    return this.repository.all({ roles });
  }

  public getAllAcl(): Promise<Acl[]> {
    return this.repository.all();
  }

  public getDefaultRoles(): Promise<AclRole[]> {
    return this.repository.roles({ isDefault: true });
  }

  protected entitiesToGrants(entities: AclEntity[]) {
    return entities.map((entity: AclEntity) => {
      return {
        role: entity.role.role,
        resource: entity.resource.resource,
        action: entity.action.action + ':' + entity.possession.possession,
        attributes: entity.attributes.split(';')
      }
    });
  }

}
