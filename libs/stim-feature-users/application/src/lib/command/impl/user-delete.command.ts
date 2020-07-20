import { ICommand } from '@nestjs/cqrs';

export class UserDeleteCommand implements ICommand {
  constructor(public readonly userId: number) {}
}
