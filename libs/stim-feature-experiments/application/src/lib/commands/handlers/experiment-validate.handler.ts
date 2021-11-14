import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ClassType, transformAndValidate } from '@stechy1/class-transformer-validator';
import { ExperimentType } from '@stechy1/diplomka-share';

import { transformValidationErrors, DtoFactory } from '@neuro-server/stim-lib-common';
import { ExperimentNotValidException } from '@neuro-server/stim-feature-experiments/domain';

import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

@CommandHandler(ExperimentValidateCommand)
export class ExperimentValidateHandler implements ICommandHandler<ExperimentValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(ExperimentValidateHandler.name);

  constructor(private readonly dtoFactory: DtoFactory) {}

  async execute(command: ExperimentValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat experiment...');
    this.logger.debug('1. Připravím si název schématu.');
    // Nechám si sestavit název schámatu
    const schemaName = `experiment-${ExperimentType[command.experiment.type]?.toLowerCase()}`;
    this.logger.debug(`Název byl sestaven: ${schemaName}.`);
    this.logger.debug('2. Získám DTO objekt s pravidly.');
    // Získám DTO
    const dto: ClassType<any> = this.dtoFactory.getDTO(ExperimentType[command.experiment.type]);
    this.logger.debug('3. Zvaliduji expeirment.');
    // Zvaliduji experiment
    try {
      await transformAndValidate(dto, command.experiment, { validator: { groups: command.validationGroups } });
      this.logger.debug('Validace byla úspěšná.');
      return true;
    } catch (e) {
      throw new ExperimentNotValidException(command.experiment, transformValidationErrors(e));
    }
  }
}
