import { ICommand } from '@nestjs/cqrs';
import { User } from '@stechy1/diplomka-share';

export class LoginCommand implements ICommand {
  constructor(public readonly user: User, public readonly ipAddress: string, public readonly clientId: string) {}
}
