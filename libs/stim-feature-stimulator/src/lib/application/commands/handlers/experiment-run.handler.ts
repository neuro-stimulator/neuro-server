import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentRunCommand } from '../impl/experiment-run.command';
import { Logger } from '@nestjs/common';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler
  implements ICommandHandler<ExperimentRunCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentRunHandler.name);
  constructor(private readonly service: StimulatorService) {}

  async execute(command: ExperimentRunCommand): Promise<void> {
    this.service.runExperiment(command.experimentID);
  }
}
