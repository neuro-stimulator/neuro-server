import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { User } from '@stechy1/diplomka-share';

import { BaseRepository } from '@neuro-server/stim-lib-common';

import { UserEntity } from '../model/entity/user.entity';
import { entityToUser, userToEntity } from './users.mapping';
import { UserFindOptions } from './user.find-options';

@Injectable()
export class UsersRepository extends BaseRepository {

  private static readonly ALIAS = 'user';

  private readonly _repository: Repository<UserEntity>;

  constructor(_manager: EntityManager) {
    super();
    this._repository = _manager.getRepository(UserEntity);
  }

  protected prepareFindQuery(findOptions: UserFindOptions): SelectQueryBuilder<UserEntity> {
    const query = this._repository
                      .createQueryBuilder(UsersRepository.ALIAS)
                      .leftJoinAndSelect(`${UsersRepository.ALIAS}.userGroups`, 'userGroup');

    if (findOptions.userGroups !== undefined) {
      query.where('userGroup.id IN (:...groups)', { groups: findOptions.userGroups });
    }

    if (findOptions.optionalOptions) {
      super.addFindOptions(query, findOptions.optionalOptions, UsersRepository.ALIAS);
    }

    return query;
  }

  async all(findOptions: UserFindOptions): Promise<User[]> {
    const query = this.prepareFindQuery(findOptions);

    const userEntities: UserEntity[] = await query.getMany();

    return userEntities.map((value: UserEntity) => entityToUser(value));
  }

  async one(findOptions: UserFindOptions): Promise<User | undefined> {
    const query = this.prepareFindQuery(findOptions);

    const userEntity: UserEntity = await query.getOne();

    if (!userEntity) {
      return undefined;
    }

    return entityToUser(userEntity);
  }

  async insert(user: User): Promise<any> {
    return this._repository.insert(userToEntity(user));
  }

  async update(user: User): Promise<any> {
    return this._repository.update({ id: user.id }, userToEntity(user));
  }

  async delete(id: number): Promise<any> {
    return this._repository.delete({ id });
  }
}
