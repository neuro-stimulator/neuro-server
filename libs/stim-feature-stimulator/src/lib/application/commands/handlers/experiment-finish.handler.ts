import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler
  implements ICommandHandler<ExperimentFinishCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentFinishHandler.name);

  constructor(private readonly service: StimulatorService) {}

  async execute(command: ExperimentFinishCommand): Promise<void> {
    this.service.finishExperiment(command.experimentID);
  }
}
