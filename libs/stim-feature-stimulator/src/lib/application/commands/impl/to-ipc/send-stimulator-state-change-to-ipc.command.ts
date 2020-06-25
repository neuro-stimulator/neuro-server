import { ICommand } from '@nestjs/cqrs';

export class SendStimulatorStateChangeToIpcCommand implements ICommand {
  constructor(public readonly state: number) {}
}
