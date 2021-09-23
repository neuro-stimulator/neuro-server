import { ICommand } from '@nestjs/cqrs';

export class ExperimentResultDeleteCommand implements ICommand {
  constructor(public readonly userGroups: number[], public readonly experimentResultID: number) {}
}
