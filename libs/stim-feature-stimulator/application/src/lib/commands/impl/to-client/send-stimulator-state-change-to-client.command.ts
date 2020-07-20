import { ICommand } from '@nestjs/cqrs';

export class SendStimulatorStateChangeToClientCommand implements ICommand {
  constructor(public readonly state: number) {}
}
