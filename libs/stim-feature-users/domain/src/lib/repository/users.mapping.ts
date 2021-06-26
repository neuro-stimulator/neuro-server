import { UserEntity } from '../model/entity/user.entity';
import { User } from '@stechy1/diplomka-share';

export function entityToUser(entity: UserEntity): User {
  return {
    id: entity.id,
    uuid: entity.uuid,
    username: entity.username,
    email: entity.email,
    password: entity.password,
    lastLoginDate: entity.lastLoginDate,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function userToEntity(user: User): UserEntity {
  const entity = new UserEntity();

  entity.id = user.id;
  entity.uuid = user.uuid;
  entity.username = user.username;
  entity.email = user.email;
  entity.password = user.password;
  entity.lastLoginDate = user.lastLoginDate;
  entity.createdAt = user.createdAt;
  entity.updatedAt = user.updatedAt;

  return entity;
}
