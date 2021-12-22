import { ICommand } from '@nestjs/cqrs';

export class AclDeleteCommand implements ICommand {
  constructor(public readonly id: number) {}
}
