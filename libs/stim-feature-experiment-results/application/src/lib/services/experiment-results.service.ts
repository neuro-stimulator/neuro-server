import { EntityManager } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';

import { ExperimentResult } from '@stechy1/diplomka-share';

import {
  ExperimentResultsRepository,
  ExperimentResultIdNotFoundException,
  ExperimentResultFindOptions
} from '@neuro-server/stim-feature-experiment-results/domain';
import { jsonObjectDiff } from '@neuro-server/stim-lib-common';

@Injectable()
export class ExperimentResultsService {
  public static readonly EXPERIMENT_RESULTS_DIRECTORY_NAME = 'experiment-results';

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly _repository: ExperimentResultsRepository;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getCustomRepository(ExperimentResultsRepository);
  }

  public async findAll(findOptions: ExperimentResultFindOptions): Promise<ExperimentResult[]> {
    this.logger.verbose('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this._repository.all(findOptions);
    this.logger.verbose(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  public async byId(userGroups: number[], id: number): Promise<ExperimentResult> {
    this.logger.verbose(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this._repository.one({ userGroups: userGroups, optionalOptions: { id } });
    if (experimentResult === undefined) {
      throw new ExperimentResultIdNotFoundException(id);
    }
    return experimentResult;
  }

  public async insert(experimentResult: ExperimentResult, userID: number): Promise<number> {
    this.logger.verbose('Vkládám nový výsledek experimentu do databáze.');
    const result: ExperimentResult = await this._repository.insert(experimentResult, userID);
    return result.id;
  }

  public async update(userGroups: number[], experimentResult: ExperimentResult): Promise<boolean> {
    const originalExperiment = await this.byId(userGroups, experimentResult.id);
    const diff = jsonObjectDiff(experimentResult, originalExperiment);
    this.logger.log(`Diff: ${JSON.stringify(diff)}`);

    if (Object.keys(diff).length === 0) {
      this.logger.verbose('Není co aktualizovat. Žádné změny nebyly detekovány.');
      return false;
    }

    this.logger.verbose('Aktualizuji výsledek experimentu.');
    const result = await this._repository.update(experimentResult);

    return true;
  }

  public async delete(id: number): Promise<void> {
    this.logger.verbose(`Mažu výsledek experimentu s id: ${id}.`);
    const result = await this._repository.delete(id);
  }

  public async nameExists(name: string, id: number): Promise<boolean> {
    this.logger.verbose(`Testuji, zda-li zadaný název pro existující výsledek experimentu již existuje: ${name}.`);
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }
}
