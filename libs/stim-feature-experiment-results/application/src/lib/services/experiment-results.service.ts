import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { createEmptyExperimentResult, Experiment, ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentIsNotInitializedException,
  ExperimentResultsRepository,
  ExperimentResultIdNotFoundError,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-experiment-results/domain';

@Injectable()
export class ExperimentResultsService {
  public static readonly EXPERIMENT_RESULTS_DIRECTORY_NAME = 'experiment-results';

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly _repository: ExperimentResultsRepository;
  private readonly _experimentResultWrapper: {
    experimentResult: ExperimentResult;
    experimentData: IOEvent[];
  } = {
    experimentResult: null,
    experimentData: [],
  };

  constructor(_manager: EntityManager) {
    this._repository = _manager.getCustomRepository(ExperimentResultsRepository);
  }

  public async findAll(): Promise<ExperimentResult[]> {
    this.logger.verbose('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this._repository.all();
    this.logger.verbose(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  public async byId(id: number): Promise<ExperimentResult> {
    this.logger.verbose(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this._repository.one(id);
    if (experimentResult === undefined) {
      throw new ExperimentResultIdNotFoundError(id);
    }
    return experimentResult;
  }

  public async insert(): Promise<number> {
    this.logger.verbose('Vkládám nový výsledek experimentu do databáze.');
    const result = await this._repository.insert(this.activeExperimentResult);
    return result.raw;
  }

  public async update(experimentResult: ExperimentResult): Promise<void> {
    const originalExperiment = await this.byId(experimentResult.id);

    this.logger.verbose('Aktualizuji výsledek experimentu.');
    const result = await this._repository.update(experimentResult);
  }

  public async delete(id: number): Promise<void> {
    const experiment = await this.byId(id);

    this.logger.verbose(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this._repository.delete(id);
  }

  public async nameExists(name: string, id: number): Promise<boolean> {
    this.logger.verbose(`Testuji, zda-li zadaný název pro existující výsledek experimentu již existuje: ${name}.`);
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }

  public clearRunningExperimentResult() {
    this.logger.verbose('Mažu aktuální výsledek experimentu a jeho data.');
    this._experimentResultWrapper.experimentResult = null;
    this._experimentResultWrapper.experimentData = [];
  }

  public createEmptyExperimentResult(experiment: Experiment): ExperimentResult {
    if (this._experimentResultWrapper.experimentResult) {
      throw new AnotherExperimentResultIsInitializedException(this._experimentResultWrapper.experimentResult, experiment);
    }

    this._experimentResultWrapper.experimentResult = createEmptyExperimentResult(experiment);

    this._experimentResultWrapper.experimentData = [];
    return this.activeExperimentResult;
  }

  public get activeExperimentResult(): ExperimentResult {
    if (!this._experimentResultWrapper.experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._experimentResultWrapper.experimentResult;
  }

  public get activeExperimentResultData(): IOEvent[] {
    if (!this._experimentResultWrapper.experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return [...this._experimentResultWrapper.experimentData];
  }

  public pushResultData(data: IOEvent) {
    this.logger.verbose('Připojuji další data do výsledku experimentu.');
    this.logger.verbose(data);
    if (!this._experimentResultWrapper.experimentResult) {
      throw new ExperimentIsNotInitializedException();
    }
    this._experimentResultWrapper.experimentData.push(data);
  }
}
