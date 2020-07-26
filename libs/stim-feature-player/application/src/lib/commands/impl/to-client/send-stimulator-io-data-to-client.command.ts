import { ICommand } from '@nestjs/cqrs';

import { IOEvent } from '@stechy1/diplomka-share';

export class SendStimulatorIoDataToClientCommand implements ICommand {
  constructor(public readonly ioEvent: IOEvent) {}
}
