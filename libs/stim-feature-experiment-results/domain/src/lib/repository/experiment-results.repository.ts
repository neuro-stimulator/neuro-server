import { EntityManager, EntityRepository, Not, Repository } from 'typeorm';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultEntity } from '../model/entity/experiment-result.entity';
import { entityToExperimentResult, experimentResultToEntity } from './experiment-results.mapping';
import { FindManyOptions } from 'typeorm';

@EntityRepository()
export class ExperimentResultsRepository {
  private readonly _repository: Repository<ExperimentResultEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(ExperimentResultEntity);
  }

  async all(options?: FindManyOptions<ExperimentResultEntity>): Promise<ExperimentResult[]> {
    const experimentResultEntities: ExperimentResultEntity[] = await this._repository.find(options);

    return experimentResultEntities.map((value: ExperimentResultEntity) => entityToExperimentResult(value));
  }

  async one(id: number, userId: number): Promise<ExperimentResult | undefined> {
    const experimentResultEntity = await this._repository.findOne({ where: { id, userId } });
    if (experimentResultEntity === undefined) {
      return undefined;
    }

    return entityToExperimentResult(experimentResultEntity);
  }

  async insert(experiment: ExperimentResult, userId: number): Promise<any> {
    const entity: ExperimentResultEntity = experimentResultToEntity(experiment);
    entity.userId = userId;

    return this._repository.insert(entity);
  }

  async update(experiment: ExperimentResult): Promise<any> {
    return this._repository.update({ id: experiment.id }, experimentResultToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this._repository.delete({ id });
  }

  async nameExists(name: string, id: number): Promise<boolean> {
    const record = await this._repository.findOne({ name, id: Not(id) });
    return record !== undefined;
  }
}
