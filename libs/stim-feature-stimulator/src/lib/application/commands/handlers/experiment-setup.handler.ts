import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentSetupCommand } from '../impl/experiment-setup.command';
import { Logger } from '@nestjs/common';

@CommandHandler(ExperimentSetupCommand)
export class ExperimentSetupHandler
  implements ICommandHandler<ExperimentSetupCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentSetupHandler.name);
  constructor(private readonly service: StimulatorService) {}

  async execute(command: ExperimentSetupCommand): Promise<void> {
    this.service.setupExperiment(command.experimentID);
  }
}
