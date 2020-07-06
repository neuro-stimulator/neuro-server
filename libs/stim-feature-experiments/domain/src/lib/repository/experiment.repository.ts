import { Injectable } from '@nestjs/common';
import { EntityManager, FindManyOptions, Not, Repository } from 'typeorm';

import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentEntity } from '../model/entity/experiment.entity';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentRepository {
  private _repository: Repository<ExperimentEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(ExperimentEntity);
  }

  async all(
    options?: FindManyOptions<ExperimentEntity>
  ): Promise<Experiment[]> {
    const experimentEntities: ExperimentEntity[] = await this._repository.find(
      options
    );

    return experimentEntities.map((value: ExperimentEntity) =>
      entityToExperiment(value)
    );
  }

  async one(id: number): Promise<Experiment> {
    const experimentEntity: ExperimentEntity = await this._repository.findOne(
      id
    );
    if (experimentEntity === undefined) {
      return undefined;
    }

    return entityToExperiment(experimentEntity);
  }

  async insert(experiment: Experiment): Promise<any> {
    return this._repository.insert(experimentToEntity(experiment));
  }

  async update(experiment: Experiment): Promise<any> {
    return this._repository.update(
      { id: experiment.id },
      experimentToEntity(experiment)
    );
  }

  async delete(id: number): Promise<any> {
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
