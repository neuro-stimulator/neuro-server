import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { ExperimentEntity } from '../entity/experiment.entity';
import { Experiment } from '@stechy1/diplomka-share';
import { entityToExperiment, experimentToEntity } from '../experiments.mapping';

@EntityRepository()
export class ExperimentRepository {

  private repository: Repository<ExperimentEntity>;

  constructor(_manager: EntityManager) {
    this.repository = _manager.getRepository(ExperimentEntity);
  }

  async all(): Promise<Experiment[]> {
    const experimentEntities: ExperimentEntity[] = await this.repository.find();

    return experimentEntities.map(value => entityToExperiment(value));
  }

  async one(id: number): Promise<Experiment> {
    const experimentEntity: ExperimentEntity = await this.repository.findOne(id);
    if (experimentEntity === undefined) {
      return undefined;
    }

    return entityToExperiment(experimentEntity);
  }

  async insert(experiment: Experiment): Promise<any> {
    return this.repository.insert(experimentToEntity(experiment));
  }

  async update(experiment: Experiment): Promise<any> {
    return this.repository.update({ id: experiment.id }, experimentToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete({ id });
  }

}
