import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { FindManyOptions } from 'typeorm';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultsRepository, ExperimentResultIdNotFoundException, ExperimentResultEntity } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { jsonObjectDiff } from '@diplomka-backend/stim-lib-common';

@Injectable()
export class ExperimentResultsService {
  public static readonly EXPERIMENT_RESULTS_DIRECTORY_NAME = 'experiment-results';

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly _repository: ExperimentResultsRepository;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getCustomRepository(ExperimentResultsRepository);
  }

  public async findAll(options?: FindManyOptions<ExperimentResultEntity>): Promise<ExperimentResult[]> {
    this.logger.verbose('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this._repository.all(options);
    this.logger.verbose(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  public async byId(id: number, userID: number): Promise<ExperimentResult> {
    this.logger.verbose(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this._repository.one(id, userID);
    if (experimentResult === undefined) {
      throw new ExperimentResultIdNotFoundException(id);
    }
    return experimentResult;
  }

  public async insert(experimentResult: ExperimentResult, userID: number): Promise<number> {
    this.logger.verbose('Vkládám nový výsledek experimentu do databáze.');
    const result = await this._repository.insert(experimentResult, userID);
    return result.raw;
  }

  public async update(experimentResult: ExperimentResult, userID: number): Promise<void> {
    const originalExperiment = await this.byId(experimentResult.id, userID);
    const diff = jsonObjectDiff(experimentResult, originalExperiment);
    this.logger.log(`Diff: ${JSON.stringify(diff)}`);

    this.logger.verbose('Aktualizuji výsledek experimentu.');
    const result = await this._repository.update(experimentResult);
  }

  public async delete(id: number, userID: number): Promise<void> {
    const experiment = await this.byId(id, userID);

    this.logger.verbose(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this._repository.delete(id);
  }

  public async nameExists(name: string, id: number): Promise<boolean> {
    this.logger.verbose(`Testuji, zda-li zadaný název pro existující výsledek experimentu již existuje: ${name}.`);
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }
}
