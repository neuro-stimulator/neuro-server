import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Schema, Validator, ValidatorResult } from 'jsonschema';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { SequenceNotValidException } from '../../../domain/exception/sequence-not-valid.exception';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';

@CommandHandler(SequenceValidateCommand)
export class SequenceValidateHandler implements ICommandHandler<SequenceValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(SequenceValidateHandler.name);

  constructor(private readonly facade: FileBrowserFacade, private readonly validator: Validator) {}

  async execute(command: SequenceValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat sekvenci...');
    this.logger.debug('1. připravím si cestu ke schématu.');
    // Nechám si sestavit cestu ke schématu
    const schemaPath = 'schemas/sequence.json';
    this.logger.debug(`Cesta byla vytvořena: ${schemaPath}.`);
    this.logger.debug('2. Přečtu schéma.');
    // Z cesty přečtu JSON schéma
    const schema = await this.facade.readPrivateJSONFile<Schema>(schemaPath);
    this.logger.debug('3. Zvaliduji sekvenci.');
    // Zvaliduji sekvencí a uložím schéma
    const result: ValidatorResult = this.validator.validate(command.sequence, schema);
    this.logger.debug('Validace byla úspěšná.');
    if (!result.valid) {
      this.logger.error('Sekvence není validní!');
      throw new SequenceNotValidException(command.sequence);
    }

    return result.valid;
  }
}
