import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { transformAndValidate } from 'class-transformer-validator';

import { transformValidationErrors } from '@diplomka-backend/stim-lib-common';
import { SequenceDTO, SequenceNotValidException } from '@diplomka-backend/stim-feature-sequences/domain';

import { SequenceValidateCommand } from '../impl/sequence-validate.command';

@CommandHandler(SequenceValidateCommand)
export class SequenceValidateHandler implements ICommandHandler<SequenceValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(SequenceValidateHandler.name);

  async execute(command: SequenceValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat sekvenci...');
    // Zvaliduji sekvencí
    try {
      await transformAndValidate(SequenceDTO, command.sequence, { validator: { groups: command.validationGroups } });
      this.logger.debug('Validace byla úspěšná.');
      return true;
    } catch (e) {
      throw new SequenceNotValidException(command.sequence, transformValidationErrors(e));
    }
  }
}
