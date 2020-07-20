import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { UserNotFoundException } from '@diplomka-backend/stim-feature-users/domain';

import { UsersService } from '../../service/users.service';
import { UserByEmailPasswordQuery } from '../impl/user-by-email-password.query';

@QueryHandler(UserByEmailPasswordQuery)
export class UserByEmailPasswordHandler implements IQueryHandler<UserByEmailPasswordQuery> {
  private readonly logger: Logger = new Logger(UserByEmailPasswordHandler.name);

  constructor(private readonly service: UsersService) {}

  async execute(query: UserByEmailPasswordQuery): Promise<any> {
    this.logger.debug('Budu vyhledávat uživatele podle emailu.');
    const user: User = await this.service.byEmail(query.email);

    this.logger.debug('Porovnávám hesla.');
    const validPassword = await this.service.compare(query.password, user.password);
    if (!validPassword) {
      this.logger.debug('Bylo zadáno neplatné heslo.');
      throw new UserNotFoundException();
    }
    delete user.password;

    this.logger.debug('Zadané heslo je validní.');
    return user;
  }
}
