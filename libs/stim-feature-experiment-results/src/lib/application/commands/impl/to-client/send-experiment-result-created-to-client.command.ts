import { ICommand } from '@nestjs/cqrs';

export class SendExperimentResultCreatedToClientCommand implements ICommand {
  constructor(public readonly experimentResultID: number) {}
}
