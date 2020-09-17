import { ICommand } from '@nestjs/cqrs';

export class PublishClientReadyCommand implements ICommand {
  constructor(public readonly clientID: string) {}
}
