import { transformAndValidate } from '@stechy1/class-transformer-validator';

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentResultDTO, ExperimentResultNotValidException } from '@neuro-server/stim-feature-experiment-results/domain';
import { transformValidationErrors } from '@neuro-server/stim-lib-common';

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
