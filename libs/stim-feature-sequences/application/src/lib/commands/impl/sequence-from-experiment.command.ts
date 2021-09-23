import { ICommand } from '@nestjs/cqrs';

export class SequenceFromExperimentCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly userGroups: number[],
    public readonly experimentID: number,
    public readonly name: string,
    public readonly size: number
  ) {}
}
