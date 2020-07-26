import { ICommand } from '@nestjs/cqrs';

import { IOEvent } from '@stechy1/diplomka-share';

export class ProcessStimulatorIoDataCommand implements ICommand {
  constructor(public readonly data: IOEvent) {}
}
