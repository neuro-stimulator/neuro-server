import { Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { User } from '@stechy1/diplomka-share';

import { UserEntity } from '../model/entity/user.entity';
import { entityToUser, userToEntity } from './users.mapping';

@Injectable()
export class UsersRepository {
  private readonly _repository: Repository<UserEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(UserEntity);
  }

  async all(options?: FindManyOptions<UserEntity>): Promise<User[]> {
    const userEntities: UserEntity[] = await this._repository.find(options);

    return userEntities.map((value: UserEntity) => entityToUser(value));
  }
  async one(options: FindOneOptions<UserEntity>): Promise<User | undefined> {
    const userEntity = await this._repository.findOne(options);
    if (userEntity === undefined) {
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
