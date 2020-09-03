import { ICommand } from '@nestjs/cqrs';

export class StimulatorSetOutputCommand implements ICommand {
  constructor(public readonly index: number, public readonly enabled: boolean, public readonly waitForResponse = false) {}
}
