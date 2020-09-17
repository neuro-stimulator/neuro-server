import { ICommand } from '@nestjs/cqrs';

export class CheckStimulatorStateConsistencyCommand implements ICommand {
  constructor(public readonly state: number) {}
}
