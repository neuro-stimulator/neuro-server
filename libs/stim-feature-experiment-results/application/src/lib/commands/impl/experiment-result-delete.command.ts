import { ICommand } from '@nestjs/cqrs';

export class ExperimentResultDeleteCommand implements ICommand {
  constructor(public readonly experimentResultID: number, public readonly userID: number) {}
}
