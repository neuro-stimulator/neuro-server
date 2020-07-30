import { ICommand } from '@nestjs/cqrs';

import { IOEvent } from '@stechy1/diplomka-share';

export class SendExperimentStateToClientCommand implements ICommand {
  constructor(
    public readonly initialized: boolean,
    public readonly ioData: IOEvent[][],
    public readonly repeat: number,
    public readonly betweenExperimentInterval: number,
    public readonly autoplay: boolean,
    public readonly isBreakTime: boolean,
    public readonly clientID?: string
  ) {}
}
