import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { transformAndValidate } from 'class-transformer-validator';

import { transformValidationErrors } from '@diplomka-backend/stim-lib-common';
import { ExperimentResultDTO, ExperimentResultNotValidException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';

@CommandHandler(ExperimentResultValidateCommand)
export class ExperimentResultValidateHandler implements ICommandHandler<ExperimentResultValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(ExperimentResultValidateHandler.name);

  async execute(command: ExperimentResultValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat výsledek experimentu...');
    // Zvaliduji experiment
    try {
      await transformAndValidate(ExperimentResultDTO, command.experimentResult, { validator: { groups: command.validationGroups } });
      this.logger.debug('Validace byla úspěšná.');
      return true;
    } catch (e) {
      throw new ExperimentResultNotValidException(command.experimentResult, transformValidationErrors(e));
    }
  }
}
