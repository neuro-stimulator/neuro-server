import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, FindConditions, FindManyOptions, Repository } from 'typeorm';

import { Acl, AclAction, AclPossession, AclResource, AclRole } from '@stechy1/diplomka-share';

import { AclEntity } from '../model/entity/acl.entity';
import { AclRoleEntity } from '../model/entity/acl-role.entity';
import { AclPossessionEntity } from '../model/entity/acl-possession.entity';
import { AclActionEntity } from '../model/entity/acl-action.entity';
import { AclResourceEntity } from '../model/entity/acl-resource.entity';
import { aclToEntity, entityToAcl, entityToAclAction, entityToAclPossession, entityToAclResource, entityToAclRole } from './acl.mapping';
import { AclFindOptions } from './acl.find-options';

@Injectable()
export class AclRepository {

  private readonly logger: Logger = new Logger(AclRepository.name);

  private readonly _repository: Repository<AclEntity>;
  private readonly _actionRepository: Repository<AclActionEntity>;
  private readonly _possessionRepository: Repository<AclPossessionEntity>;
  private readonly _resourceRepository: Repository<AclResourceEntity>;
  private readonly _roleRepository: Repository<AclRoleEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._repository = _manager.getRepository<AclEntity>(AclEntity);
    this._actionRepository = _manager.getRepository<AclActionEntity>(AclActionEntity)
    this._possessionRepository = _manager.getRepository<AclPossessionEntity>(AclPossessionEntity)
    this._resourceRepository = _manager.getRepository<AclResourceEntity>(AclResourceEntity)
    this._roleRepository = _manager.getRepository<AclRoleEntity>(AclRoleEntity);
  }

  /* --------------------------------- ACL ---------------------------------- */

  /**
   * Vrátí všechna ACL, která vyhovují parametrům
   *
   * @param findOptions
   */
  public async all(findOptions?: AclFindOptions): Promise<Acl[]> {
    const findManyOptions: FindManyOptions<AclEntity> = {};
    if (findOptions) {
      if (findOptions.roles) {
        findManyOptions.where = findOptions.roles.map(role => {
          const entity = new AclRoleEntity();
          entity.id = role;
          return {
            role: entity
          }
        })
      }
    }
    const aclEntities: AclEntity[] = await this._repository.find(findManyOptions);

    return aclEntities.map((value: AclEntity) => entityToAcl(value));
  }

  public async byId(id: number): Promise<Acl> {
    const entity: AclEntity = await this._repository.findOne(id);

    if (entity === undefined) {
      return undefined;
    }

    return entityToAcl(entity);
  }

  public async insert(acl: Acl): Promise<Acl> {
    const entity: AclEntity = aclToEntity(acl);

    const resultEntity: AclEntity = await this._repository.save(entity);

    return entityToAcl(resultEntity);
  }

  public async update(acl: Acl): Promise<Acl> {
    return entityToAcl(await this._repository.save(aclToEntity(acl)));
  }

  public async delete(id: number): Promise<DeleteResult> {
    return this._repository.delete({ id });
  }

  /* ------------------------------- ACL Role ------------------------------- */

  public async roles(findConditions?: FindConditions<AclRoleEntity>): Promise<AclRole[]> {
    const findOptions: FindManyOptions = {};
    if (findConditions) {
      findOptions.where = findConditions;
    }
    const roleEntities: AclRoleEntity[] = await this._roleRepository.find(findOptions);

    return roleEntities.map((roleEntity: AclRoleEntity) => entityToAclRole(roleEntity));
  }

  /* ---------------------------- ACL Possession ---------------------------- */

  public async possessions(findConditions?: FindConditions<AclPossessionEntity>): Promise<AclPossession[]> {
    const findOptions: FindManyOptions = {};
    if (findConditions) {
      findOptions.where = findConditions;
    }
    const possessionEntities: AclPossessionEntity[] = await this._possessionRepository.find(findOptions);

    return possessionEntities.map((possessionEntity: AclPossessionEntity) => entityToAclPossession(possessionEntity));
  }

  /* ----------------------------- ACL Resource ----------------------------- */

  public async resources(findConditions?: FindConditions<AclResourceEntity>): Promise<AclResource[]> {
    const findOptions: FindManyOptions = {};
    if (findConditions) {
      findOptions.where = findConditions;
    }
    const possessionEntities: AclResourceEntity[] = await this._resourceRepository.find(findOptions);

    return possessionEntities.map((possessionEntity: AclResourceEntity) => entityToAclResource(possessionEntity));
  }

  /* ------------------------------ ACL Action ------------------------------ */

  public async actions(findConditions?: FindConditions<AclActionEntity>): Promise<AclAction[]> {
    const findOptions: FindManyOptions = {};
    if (findConditions) {
      findOptions.where = findConditions;
    }
    const possessionEntities: AclActionEntity[] = await this._actionRepository.find(findOptions);

    return possessionEntities.map((possessionEntity: AclActionEntity) => entityToAclAction(possessionEntity));
  }
}
