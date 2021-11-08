import { ICommand } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { USER_FULL_GROUP } from '@neuro-server/stim-feature-users/domain';

export class UserValidateCommand implements ICommand {
  constructor(public readonly user: User, public readonly validationGroups: string[] = [USER_FULL_GROUP]) {}
}
