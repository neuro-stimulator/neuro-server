import { ICommand } from '@nestjs/cqrs';

export class SendIpcStateToClientCommand implements ICommand {
  constructor(public readonly clientID: string) {}
}
