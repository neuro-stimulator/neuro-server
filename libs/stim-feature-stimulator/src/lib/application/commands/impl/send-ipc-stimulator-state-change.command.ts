import { ICommand } from '@nestjs/cqrs';

export class SendIpcStimulatorStateChangeCommand implements ICommand {
  constructor(public readonly state: number) {}
}
