import { ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';

export class ExperimentResultValidateHandler
  implements ICommandHandler<ExperimentResultValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(
    ExperimentResultValidateHandler.name
  );
  private readonly validator: Validator = new Validator();

  constructor(private readonly facade: FileBrowserFacade) {}

  async execute(command: ExperimentResultValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat výsledek experimentu...');
    this.logger.debug('1. připravím si cestu ke schématu.');
    // Nechám si sestavit cestu ke schématu
    const schemaPath = 'schemas/experiment-result.json';
    this.logger.debug(`\t Cesta byla vytvořena: ${schemaPath}.`);
    this.logger.debug('2. Přečtu schéma.');
    // Z cesty přečtu JSON schéma
    const schema = await this.facade.readPrivateJSONFile<Schema>(schemaPath);
    this.logger.debug('3. Zvaliduji výsledek expeirmentu.');
    // Zvaliduji sekvencí a uložím schéma
    const result: ValidatorResult = this.validator.validate(
      command.experimentResult,
      schema
    );
    this.logger.debug('Validace byla úspěšná.');
    if (!result.valid) {
      this.logger.error('Výsledek experimentu není validní!');
    }

    return result.valid;
  }
}
