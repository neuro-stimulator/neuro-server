import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { UserByIdQuery } from '@diplomka-backend/stim-feature-users/application';

import { UsersService } from '../../service/users.service';

@QueryHandler(UserByIdQuery)
export class UserByIdHandler implements IQueryHandler<UserByIdQuery, User> {
  private readonly logger: Logger = new Logger(UserByIdHandler.name);

  constructor(private readonly service: UsersService) {}

  async execute(query: UserByIdQuery): Promise<User> {
    this.logger.debug('Budu vyhledávat uživatele podle id.');
    return this.service.byId(query.userID);
  }
}
