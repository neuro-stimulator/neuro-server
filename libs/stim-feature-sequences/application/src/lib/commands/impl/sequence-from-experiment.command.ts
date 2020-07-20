import { ICommand } from '@nestjs/cqrs';

export class SequenceFromExperimentCommand implements ICommand {
  constructor(public readonly experimentID: number, public readonly name: string, public readonly size: number) {}
}
