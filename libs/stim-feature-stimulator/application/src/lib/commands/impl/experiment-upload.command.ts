import { ICommand } from '@nestjs/cqrs';
import { StimulatorBlockingCommand } from './base/stimulator-blocking.command';

export class ExperimentUploadCommand implements ICommand, StimulatorBlockingCommand {
  public readonly commandType = 'upload';

  constructor(
    public readonly userGroups: number[],
    public readonly experimentID: number,
    public readonly sequenceSize?: number,
    public readonly waitForResponse = false) {}
}
