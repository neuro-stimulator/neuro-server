import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { WriteExperimentResultToFileCommand } from '../impl/write-experiment-result-to-file.command';

@CommandHandler(WriteExperimentResultToFileCommand)
export class WriteExperimentResultToFileHandler
  implements ICommandHandler<WriteExperimentResultToFileHandler, void> {
  private readonly logger: Logger = new Logger(
    WriteExperimentResultToFileHandler.name
  );

  constructor(
    private readonly service: ExperimentResultsService,
    private readonly facade: FileBrowserFacade
  ) {}

  async execute(command: WriteExperimentResultToFileHandler): Promise<void> {
    this.logger.debug(
      'Budu zapisovat výsledek experimentu do souboru na disk.'
    );

    this.logger.debug('1. Vytáhnu data ze service.');
    const resultData = this.service.activeExperimentResultData;
    this.logger.debug(`{resultData=${resultData}}`);
    this.logger.debug('2. Získám název souboru.');
    const fileName = this.service.activeExperimentResult?.filename;
    this.logger.debug(`{filename=${fileName}}`);
    this.logger.debug(
      '3. Sestavím absolutní cestu k souboru s výsledkem experimentu.'
    );
    const resultFilePath = await this.facade.mergePrivatePath(
      `${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}/${fileName}`
    );
    this.logger.debug(`{resultFilePath=${resultFilePath}}`);
    this.logger.debug('4. Uložím data do souboru.');
    await this.facade.writePrivateJSONFile(resultFilePath, resultData);
  }
}
