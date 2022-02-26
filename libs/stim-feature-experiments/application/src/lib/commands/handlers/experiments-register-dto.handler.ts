import { ClassType } from '@stechy1/class-transformer-validator';

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentType } from '@stechy1/diplomka-share';

import { DTO_SCOPE } from '@neuro-server/stim-feature-experiments/domain';
import { DTO, DtoService, InjectDtoService } from '@neuro-server/stim-lib-dto';

import { ExperimentsRegisterDtoCommand } from '../impl/experiments-register-dto.command';

@CommandHandler(ExperimentsRegisterDtoCommand)
export class ExperimentsRegisterDtoHandler implements ICommandHandler<ExperimentsRegisterDtoCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentsRegisterDtoHandler.name);

  constructor(@InjectDtoService(DTO_SCOPE) private readonly dtoService: DtoService<ExperimentType>) {}

  async execute(command: ExperimentsRegisterDtoCommand): Promise<void> {
    this.logger.debug('Budu registrovat DTO pro experimenty.');
    for (const [key, entry] of Object.entries(command.dtos)) {
      this.dtoService.registerDTO(+key, entry as ClassType<DTO<ExperimentType>>, entry['name']);
    }
  }
}
