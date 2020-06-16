import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentPauseCommand } from '../impl/experiment-pause.command';

@CommandHandler(ExperimentPauseCommand)
export class ExperimentPauseHandler
  implements ICommandHandler<ExperimentPauseCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentPauseHandler.name);

  constructor(private readonly service: StimulatorService) {}

  async execute(command: ExperimentPauseCommand): Promise<void> {
    this.service.pauseExperiment(command.experimentID);
  }
}
