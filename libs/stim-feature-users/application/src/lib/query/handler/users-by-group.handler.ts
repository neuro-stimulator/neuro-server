import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { UsersService } from '../../service/users.service';
import { UsersByGroupQuery } from '../impl/users-by-group.query';

@QueryHandler(UsersByGroupQuery)
export class UsersByGroupHandler implements IQueryHandler<UsersByGroupQuery, User[]> {

  constructor(private readonly service: UsersService) {}

  async execute(query: UsersByGroupQuery): Promise<User[]> {
    const users: User[] = await this.service.findAll({ userGroups: query.groups });

    return users.map((user: User) => {
      delete user.password;
      return user;
    });
  }

}
