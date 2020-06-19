import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import { ExperimentType } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

@CommandHandler(ExperimentValidateCommand)
export class ExperimentValidateHandler
  implements ICommandHandler<ExperimentValidateCommand, boolean> {
  private readonly logger: Logger = new Logger(ExperimentValidateHandler.name);
  private readonly validator: Validator = new Validator();

  constructor(private readonly facade: FileBrowserFacade) {}

  async execute(command: ExperimentValidateCommand): Promise<boolean> {
    this.logger.debug('Budu validovat experiment...');
    this.logger.debug('1. připravím si cestu ke schématu.');
    // Nechám si sestavit cestu ke schématu
    const schemaPath = `schemas/experiment-${ExperimentType[
      command.experiment.type
    ].toLowerCase()}.json`;
    this.logger.debug(`Cesta byla vytvořena: ${schemaPath}.`);
    this.logger.debug('2. Přečtu schéma.');
    // Z cesty přečtu JSON schéma
    const schema = await this.facade.readPrivateJSONFile<Schema>(schemaPath);
    this.logger.debug('3. Zvaliduji expeirment.');
    // Zvaliduji sekvencí a uložím schéma
    const result: ValidatorResult = this.validator.validate(
      command.experiment,
      schema
    );
    this.logger.debug('Validace byla úspěšná.');
    if (!result.valid) {
      this.logger.error('Experiment není validní!');
    }

    return result.valid;
  }
}
