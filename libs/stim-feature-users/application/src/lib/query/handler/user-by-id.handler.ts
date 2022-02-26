import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { UsersService } from '../../service/users.service';
import { UserByIdQuery } from '../impl/user-by-id.query';

@QueryHandler(UserByIdQuery)
export class UserByIdHandler implements IQueryHandler<UserByIdQuery, User> {
  private readonly logger: Logger = new Logger(UserByIdHandler.name);

  constructor(private readonly service: UsersService) {}

  async execute(query: UserByIdQuery): Promise<User> {
    this.logger.debug('Budu vyhledávat uživatele podle id.');
    const user: User = await this.service.byId(query.userID);
    delete user.password;

    return user;
  }
}
