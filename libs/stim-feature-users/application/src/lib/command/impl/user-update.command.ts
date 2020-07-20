import { ICommand } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

export class UserUpdateCommand implements ICommand {
  constructor(public readonly user: User) {}
}
