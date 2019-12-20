import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExperimentResult } from 'diplomka-share';

import { ExperimentResultEntity } from './experiment-result.entity';
import { entityToExperimentResult, experimentResultToEntity } from './experiment-results.mapping';

@Injectable()
export class ExperimentResultsService {

  private readonly logger = new Logger(ExperimentResultsService.name);

  constructor(@InjectRepository(ExperimentResultEntity)
              private readonly repository: Repository<ExperimentResultEntity>) {}

  async findAll(): Promise<ExperimentResult[]> {
    this.logger.log('Hledám všechny výsledky experimentů...');
    const experimentResultEntities: ExperimentResultEntity[] = await this.repository.find();
    this.logger.log(`Bylo nalezeno: ${experimentResultEntities.length} záznamů.`);
    return experimentResultEntities.map(value => entityToExperimentResult(value));
  }

  async byId(id: number): Promise<ExperimentResult> {
    this.logger.log(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResultEntity: ExperimentResultEntity = await this.repository.findOne(id);
    if (experimentResultEntity === undefined) {
      return undefined;
    }

    return entityToExperimentResult(experimentResultEntity);
  }

  async insert(experiment: ExperimentResult): Promise<ExperimentResult> {
    this.logger.log('Vkládám nový výsledek experimentu do databáze.');
    const entity: ExperimentResultEntity = this.repository.create();
    const result = await this.repository.insert(experimentResultToEntity(experiment));
    experiment.id = result.raw;

    return this.byId(experiment.id);
  }

  async update(experiment: ExperimentResult): Promise<ExperimentResult> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji výsledek experiment.');
    const result = await this.repository.update({ id: experiment.id }, experimentResultToEntity(experiment));

    return this.byId(experiment.id);
  }

  async delete(id: number): Promise<ExperimentResult> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this.repository.delete({ id });

    return experiment;
  }

}
