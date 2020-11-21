import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { InitializeExperimentResultsDirectoryCommand } from '../impl/initialize-experiment-results-directory.command';

@CommandHandler(InitializeExperimentResultsDirectoryCommand)
export class InitializeExperimentResultsDirectoryHandler implements ICommandHandler<InitializeExperimentResultsDirectoryCommand, void> {
  private readonly logger: Logger = new Logger(InitializeExperimentResultsDirectoryHandler.name);

  constructor(private readonly facade: FileBrowserFacade) {}

  async execute(command: InitializeExperimentResultsDirectoryCommand): Promise<void> {
    this.logger.debug('Budu inicializovat složku pro výsledky experimentů.');
    await this.facade.createNewFolder(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}`, 'private');
  }
}
