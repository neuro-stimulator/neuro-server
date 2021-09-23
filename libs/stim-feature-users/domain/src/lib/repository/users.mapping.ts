import { User, UserGroupInfo } from '@stechy1/diplomka-share';

import { UserEntity } from '../model/entity/user.entity';
import { GroupEntity } from '../model/entity/group.entity';

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
    userGroups: entity.userGroups?.reduce(
      (acc: Record<number, UserGroupInfo>, group: GroupEntity) => {
        acc[group.id] = { id: group.id, name: group.name };
        return acc;
      },
      {})
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
