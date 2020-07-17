import { ICommand } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

export class UserInsertCommand implements ICommand {
  constructor(public readonly user: User) {}
}
