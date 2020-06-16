import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentClearCommand } from '../impl/experiment-clear.command';

@CommandHandler(ExperimentClearCommand)
export class ExperimentClearHandler
  implements ICommandHandler<ExperimentClearCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentClearHandler.name);

  constructor(private readonly service: StimulatorService) {}

  async execute(command: ExperimentClearCommand): Promise<void> {
    this.service.clearExperiment();
  }
}
