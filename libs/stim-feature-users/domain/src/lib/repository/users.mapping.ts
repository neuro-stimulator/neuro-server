import { UserEntity } from '../model/entity/user.entity';
import { User } from '@stechy1/diplomka-share';

export function entityToUser(entity: UserEntity): User {
  return {
    id: entity.id,
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

  entity.id = <number>user.id;
  entity.username = <string>user.username;
  entity.email = <string>user.email;
  entity.password = <string>user.password;
  entity.lastLoginDate = <number>user.lastLoginDate;
  entity.createdAt = user.createdAt;
  entity.updatedAt = user.updatedAt;

  return entity;
}
