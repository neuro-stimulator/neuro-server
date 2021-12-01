import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, FindConditions, FindManyOptions, Repository } from 'typeorm';

import { Acl, AclRole } from '@stechy1/diplomka-share';

import { AclEntity } from '../model/entity/acl.entity';
import { AclRoleEntity } from '../model/entity/acl-role.entity';
import { aclToEntity, entityToAcl, entityToAclRole } from './acl.mapping';
import { AclFindOptions } from './acl.find-options';

@Injectable()
export class AclRepository {

  private readonly logger: Logger = new Logger(AclRepository.name);

  private readonly _repository: Repository<AclEntity>;
  private readonly _roleRepository: Repository<AclRoleEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._repository = _manager.getRepository(AclEntity);
    this._roleRepository = _manager.getRepository(AclRoleEntity);
  }

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

  public async roles(findConditions?: FindConditions<AclRoleEntity>): Promise<AclRole[]> {
    const findOptions: FindManyOptions = {};
    if (findConditions) {
      findOptions.where = findConditions;
    }
    const roleEntities: AclRoleEntity[] = await this._roleRepository.find(findOptions);

    return roleEntities.map((roleEntity: AclRoleEntity) => entityToAclRole(roleEntity));
  }
}
