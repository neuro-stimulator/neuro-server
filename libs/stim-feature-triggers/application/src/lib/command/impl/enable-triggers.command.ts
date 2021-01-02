import { ICommand } from '@nestjs/cqrs';

export class EnableTriggersCommand implements ICommand {
  constructor(public readonly triggerNames?: string[]) {}
}
