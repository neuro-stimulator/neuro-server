import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultEntity } from '../entity/experiment-result.entity';
import { entityToExperimentResult, experimentResultToEntity } from '../experiment-results.mapping';

@EntityRepository()
export class ExperimentResultsRepository {

  private readonly repository: Repository<ExperimentResultEntity>;

  constructor(_manager: EntityManager) {
    this.repository = _manager.getRepository(ExperimentResultEntity);
  }

  async all(): Promise<ExperimentResult[]> {
    const experimentResultEntities: ExperimentResultEntity[] = await this.repository.find();

    return experimentResultEntities.map(value => entityToExperimentResult(value));
  }

  async one(id: number): Promise<ExperimentResult> {
    const experimentResultEntity: ExperimentResultEntity = await this.repository.findOne(id);
    if (experimentResultEntity === undefined) {
      return undefined;
    }

    return entityToExperimentResult(experimentResultEntity);
  }

  async insert(experiment: ExperimentResult): Promise<any> {
    return this.repository.insert(experimentResultToEntity(experiment));
  }

  async update(experiment: ExperimentResult): Promise<any> {
    return this.repository.update({ id: experiment.id }, experimentResultToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete({ id });
  }

}
