import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { RegisterUserCommand, UserByIdQuery, UserUpdateCommand } from '@diplomka-backend/stim-feature-users/application';

@Injectable()
export class UsersFacade {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  public async register(user: User): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(user));
  }

  public async update(user: User): Promise<void> {
    return this.commandBus.execute(new UserUpdateCommand(user));
  }

  public async userById(userID: number): Promise<User> {
    return this.queryBus.execute(new UserByIdQuery(userID));
  }
}
