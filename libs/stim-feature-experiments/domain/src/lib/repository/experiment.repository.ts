import { Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager, FindManyOptions, InsertResult, Not, Repository, UpdateResult } from 'typeorm';

import { Experiment, Output } from '@stechy1/diplomka-share';

import { ExperimentEntity } from '../model/entity/experiment.entity';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentRepository {
  private _repository: Repository<ExperimentEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(ExperimentEntity);
  }

  async all(options?: FindManyOptions<ExperimentEntity>): Promise<Experiment<Output>[]> {
    const experimentEntities: ExperimentEntity[] = await this._repository.find(options);

    return experimentEntities.map((value: ExperimentEntity) => entityToExperiment(value));
  }

  async one(id: number, userId: number): Promise<Experiment<Output> | undefined> {
    const experimentEntity = await this._repository.findOne({ where: { id, userId } });
    if (experimentEntity === undefined) {
      return undefined;
    }

    return entityToExperiment(experimentEntity);
  }

  async insert(experiment: Experiment<Output>, userId: number): Promise<InsertResult> {
    const entity: ExperimentEntity = experimentToEntity(experiment);
    entity.userId = userId;

    return this._repository.insert(entity);
  }

  async update(experiment: Experiment<Output>): Promise<UpdateResult> {
    return this._repository.update({ id: experiment.id }, experimentToEntity(experiment));
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._repository.delete({ id });
  }

  async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    let record;
    if (id === 'new') {
      record = await this._repository.findOne({ name });
    } else {
      record = await this._repository.findOne({ name, id: Not(id) });
    }

    return record !== undefined;
  }
}
