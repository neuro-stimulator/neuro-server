import { ICommand } from '@nestjs/cqrs';

export class DisableTriggersCommand implements ICommand {
  constructor(public readonly triggerNames?: string[]) {}
}
