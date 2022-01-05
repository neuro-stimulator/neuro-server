import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { CreateNewFolderCommand } from '@neuro-server/stim-feature-file-browser/application';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { InitializeExperimentResultsDirectoryCommand } from '../impl/initialize-experiment-results-directory.command';

@CommandHandler(InitializeExperimentResultsDirectoryCommand)
export class InitializeExperimentResultsDirectoryHandler implements ICommandHandler<InitializeExperimentResultsDirectoryCommand, void> {
  private readonly logger: Logger = new Logger(InitializeExperimentResultsDirectoryHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(_command: InitializeExperimentResultsDirectoryCommand): Promise<void> {
    this.logger.debug('Budu inicializovat složku pro výsledky experimentů.');
    return this.commandBus.execute(new CreateNewFolderCommand(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}`, 'private'));
  }
}
