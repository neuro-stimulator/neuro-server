import { ClassType, transformAndValidate } from '@stechy1/class-transformer-validator';

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentType } from '@stechy1/diplomka-share';

import { DTO_SCOPE, ExperimentNotValidException } from '@neuro-server/stim-feature-experiments/domain';
import { transformValidationErrors } from '@neuro-server/stim-lib-common';
import { DTO, DtoService, InjectDtoService } from '@neuro-server/stim-lib-dto';

import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

@CommandHandler(ExperimentValidateCommand)
export class ExperimentValidateHandler implements ICommandHandler<ExperimentValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(ExperimentValidateHandler.name);

  constructor(@InjectDtoService(DTO_SCOPE) private readonly dtoService: DtoService<ExperimentType>) {}

  async execute(command: ExperimentValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat experiment...');
    this.logger.debug('1. Získám DTO objekt s pravidly.');
    // Získám DTO
    const dto: ClassType<DTO<ExperimentType>> = this.dtoService.getDTO(command.experiment.type);
    this.logger.debug('2. Zvaliduji expeirment.');
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
