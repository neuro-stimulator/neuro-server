import { ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { SequenceValidateCommand } from '../impl/sequence-validate.command';

export class SequenceValidateHandler
  implements ICommandHandler<SequenceValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(SequenceValidateHandler.name);
  private readonly validator: Validator = new Validator();

  constructor(private readonly facade: FileBrowserFacade) {}

  async execute(command: SequenceValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat sekvenci...');
    this.logger.debug('1. připravím si cestu ke schématu.');
    // Nechám si sestavit cestu ke schématu
    const schemaPath = 'schemas/sequence.json';
    this.logger.debug(`\t Cesta byla vytvořena: ${schemaPath}.`);
    this.logger.debug('2. Přečtu schéma.');
    // Z cesty přečtu JSON schéma
    const schema = await this.facade.readPrivateJSONFile<Schema>(schemaPath);
    this.logger.debug('3. Zvaliduji sekvenci.');
    // Zvaliduji sekvencí a uložím schéma
    const result: ValidatorResult = this.validator.validate(
      command.sequence,
      schema
    );
    this.logger.debug('Validace byla úspěšná.');
    if (!result.valid) {
      this.logger.error('Sekvence není validní!');
    }

    return result.valid;
  }
}
