import { Injectable, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentType, Output } from '@stechy1/diplomka-share';

import {
  CustomExperimentRepository,
  ExperimentEntity,
  ExperimentErpRepository,
  ExperimentCvepRepository,
  ExperimentFvepRepository,
  ExperimentTvepRepository,
  ExperimentReaRepository,
  ExperimentRepository,
  ExperimentIdNotFoundException,
} from '@diplomka-backend/stim-feature-experiments/domain';

@Injectable()
export class ExperimentsService {
  private readonly logger = new Logger(ExperimentsService.name);

  private readonly _repositoryMapping: {
    [p: string]: {
      repository: CustomExperimentRepository<any, any>;
    };
  } = {};

  constructor(
    private readonly _repository: ExperimentRepository,
    private readonly _repositoryERP: ExperimentErpRepository,
    private readonly _repositoryCVEP: ExperimentCvepRepository,
    private readonly _repositoryFVEP: ExperimentFvepRepository,
    private readonly _repositoryTVEP: ExperimentTvepRepository,
    private readonly _repositoryREA: ExperimentReaRepository
  ) {
    this._initMapping();
  }

  private _initMapping() {
    this._repositoryMapping[ExperimentType.ERP] = {
      repository: this._repositoryERP,
    };
    this._repositoryMapping[ExperimentType.CVEP] = {
      repository: this._repositoryCVEP,
    };
    this._repositoryMapping[ExperimentType.FVEP] = {
      repository: this._repositoryFVEP,
    };
    this._repositoryMapping[ExperimentType.TVEP] = {
      repository: this._repositoryTVEP,
    };
    this._repositoryMapping[ExperimentType.REA] = {
      repository: this._repositoryREA,
    };
  }

  public async findAll(options?: FindManyOptions<ExperimentEntity>): Promise<Experiment<Output>[]> {
    this.logger.verbose(`Hledám všechny experimenty s filtrem: '${JSON.stringify(options ? options.where : {})}'.`);
    const experiments: Experiment<Output>[] = await this._repository.all(options);
    this.logger.verbose(`Bylo nalezeno: ${experiments.length} záznamů.`);
    return experiments;
  }

  public async byId(id: number, userID: number): Promise<Experiment<Output>> {
    this.logger.verbose(`Hledám experiment s id: ${id}`);
    const experiment = await this._repository.one(id, userID);
    if (experiment === undefined) {
      this.logger.warn(`Experiment s id: ${id} nebyl nalezen!`);
      throw new ExperimentIdNotFoundException(id);
    }

    const realExperiment: Experiment<Output> = await this._repositoryMapping[experiment.type].repository.one(experiment);
    if (realExperiment === undefined) {
      this.logger.error('Konkrétní experiment nebyl nalezen. Databáze je v nekonzistentním stavu!!!');
    }

    return realExperiment;
  }

  public async insert(experiment: Experiment<Output>, userID: number): Promise<number> {
    this.logger.verbose('Vkládám nový experiment do databáze.');
    experiment.usedOutputs = { led: true, audio: false, image: false };
    const result = await this._repository.insert(experiment, userID);
    experiment.id = result.raw;
    const subresult = await this._repositoryMapping[experiment.type].repository.insert(experiment);
    return result.raw;
  }

  public async update(experiment: Experiment<Output>, userID: number): Promise<void> {
    const originalExperiment = await this.byId(experiment.id, userID);

    this.logger.verbose('Aktualizuji experiment.');
    experiment.usedOutputs = experiment.usedOutputs || originalExperiment.usedOutputs;
    const result = await this._repository.update(experiment);
    const subresult = await this._repositoryMapping[experiment.type].repository.update(experiment);
  }

  public async delete(id: number, userID: number): Promise<void> {
    const experiment = await this.byId(id, userID);
    if (experiment === undefined) {
      throw new ExperimentIdNotFoundException(id);
    }

    this.logger.verbose(`Mažu experiment s id: ${id}`);
    const subresult = await this._repositoryMapping[experiment.type].repository.delete(id);
    const result = await this._repository.delete(id);
  }

  public async usedOutputMultimedia(id: number, userID: number): Promise<ExperimentAssets> {
    const experiment: Experiment<Output> = await this.byId(id, userID);
    if (experiment === undefined) {
      throw new ExperimentIdNotFoundException(id);
    }

    return this._repositoryMapping[experiment.type].repository.outputMultimedia(experiment);
  }

  public async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    if (id === 'new') {
      this.logger.verbose(`Testuji, zda-li zadaný název nového experimentu již existuje: ${name}.`);
    } else {
      this.logger.verbose(`Testuji, zda-li zadaný název pro existující experiment již existuje: ${name}.`);
    }
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }
}
