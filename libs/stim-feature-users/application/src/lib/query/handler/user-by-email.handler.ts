import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UsersService } from '../../service/users.service';
import { UserByEmailQuery } from '../impl/user-by-email.query';

@QueryHandler(UserByEmailQuery)
export class UserByEmailHandler implements IQueryHandler<UserByEmailQuery> {
  private readonly logger: Logger = new Logger(UserByEmailHandler.name);

  constructor(private readonly service: UsersService) {}

  async execute(query: UserByEmailQuery): Promise<any> {
    this.logger.debug('Budu vyhledávat uživatele podle emailu.');
    return this.service.byEmail(query.email);
  }
}
