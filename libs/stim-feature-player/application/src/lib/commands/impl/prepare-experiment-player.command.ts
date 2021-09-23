import { ICommand } from '@nestjs/cqrs';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

export class PrepareExperimentPlayerCommand implements ICommand {
  constructor(
    public readonly experimentID: number,
    public readonly playerConfiguration: PlayerConfiguration,
    public readonly userID: number,
    public readonly userGroups: number[]) {}
}
