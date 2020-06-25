import { ICommand } from '@nestjs/cqrs';
import { StimulatorIoChangeData } from '@diplomka-backend/stim-feature-stimulator';

export class AppendExperimentResultDataCommand implements ICommand {
  constructor(public readonly data: StimulatorIoChangeData) {}
}
