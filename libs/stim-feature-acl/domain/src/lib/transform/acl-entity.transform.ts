import { Injectable } from '@nestjs/common';

import { Acl } from '@stechy1/diplomka-share';

import { DeepPartial, groupBy } from '@neuro-server/stim-lib-common';
import { BaseEntityTransformerService } from '@neuro-server/stim-feature-seed/application';
import { DataContainers, EntityTransformer } from '@neuro-server/stim-feature-seed/domain';

import { AclEntity } from '../model/entity/acl.entity';
import { AclActionEntity } from '../model/entity/acl-action.entity';
import { AclRoleEntity } from '../model/entity/acl-role.entity';
import { AclPossessionEntity } from '../model/entity/acl-possession.entity';
import { AclResourceEntity } from '../model/entity/acl-resource.entity';

@Injectable()
@EntityTransformer(AclEntity)
export class AclEntityTransform extends BaseEntityTransformerService<Acl, AclEntity> {

  transform(fromType: Acl, dataContainers: DataContainers): DeepPartial<AclEntity> {
    const actionId = this.decodeId<AclActionEntity>(
      fromType.action,
      dataContainers[AclActionEntity.name][0].entities as unknown as AclActionEntity[],
      (entity: AclActionEntity) => entity.action
    );

    const roleId = this.decodeId<AclRoleEntity>(
      fromType.role,
      dataContainers[AclRoleEntity.name][0].entities as unknown as AclRoleEntity[],
      (entity: AclRoleEntity) => entity.role
    );

    const possessionId = this.decodeId<AclPossessionEntity>(
      fromType.possession,
      dataContainers[AclPossessionEntity.name][0].entities as unknown as AclPossessionEntity[],
      (entity: AclPossessionEntity) => entity.possession
    );

    const resourceId = this.decodeId<AclResourceEntity>(
      fromType.resource,
      dataContainers[AclResourceEntity.name][0].entities as unknown as AclResourceEntity[],
      (entity: AclResourceEntity) => entity.resource
    );


    return {
      id: fromType.id,
      attributes: fromType.attributes,
      action: {
        id: actionId
      },
      role: {
        id: roleId
      },
      possession: {
        id: possessionId
      },
      resource: {
        id: resourceId
      }
    };
  }

  protected decodeId<E extends {id: number }>(group: string, entities: E[], groupFunction: (entity: E) => string): number {
    const entitiesInGroup: Record<string, E[]> = groupBy<E>(entities, groupFunction);
    return +entitiesInGroup[group][0].id;
  }

}
