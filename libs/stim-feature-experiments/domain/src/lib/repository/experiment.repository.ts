import { DeleteResult, EntityManager, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Experiment, Output } from '@stechy1/diplomka-share';

import { BaseRepository } from '@neuro-server/stim-lib-common';

import { ExperimentEntity } from '../model/entity/experiment.entity';

import { ExperimentFindOptions } from './experiment.find-options';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentRepository extends BaseRepository {

  private static readonly ALIAS = 'experiment';

  private _repository: Repository<ExperimentEntity>;

  constructor(_manager: EntityManager) {
    super();
    this._repository = _manager.getRepository(ExperimentEntity);
  }

  protected prepareFindQuery(findOptions: ExperimentFindOptions): SelectQueryBuilder<ExperimentEntity> {
    const query = this._repository
                      .createQueryBuilder(ExperimentRepository.ALIAS)
                      .leftJoinAndSelect(`${ExperimentRepository.ALIAS}.userGroups`, 'userGroup');

    if (findOptions.userGroups !== undefined) {
      query.where('userGroup.id IN (:...groups)', { groups: findOptions.userGroups });
    }

    if (findOptions.optionalOptions) {
      super.addFindOptions(query, findOptions.optionalOptions, ExperimentRepository.ALIAS);
    }

    return query;
  }

  async all(findOptions: ExperimentFindOptions): Promise<Experiment<Output>[]> {
    const query = this.prepareFindQuery(findOptions);

    const experimentEntities: ExperimentEntity[] = await query.getMany();

    return experimentEntities.map((value: ExperimentEntity) => entityToExperiment(value));
  }

  async one(findOptions: ExperimentFindOptions): Promise<Experiment<Output> | undefined> {
    const query = this.prepareFindQuery(findOptions);

    const experimentEntity: ExperimentEntity = await query.getOne();

    if (experimentEntity === undefined) {
      return undefined;
    }

    return entityToExperiment(experimentEntity);
  }

  async insert(experiment: Experiment<Output>, userId: number): Promise<Experiment<Output>> {
    const entity: ExperimentEntity = experimentToEntity(experiment);
    entity.userId = userId;

    const resultEntity: ExperimentEntity = await this._repository.save(entity);

    return entityToExperiment(resultEntity);
  }

  async update(experiment: Experiment<Output>): Promise<Experiment<Output>> {
    return entityToExperiment(await this._repository.save(experimentToEntity(experiment)));
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._repository.delete({ id });
  }

  async nameExists(name: string, id: number | 'new'): Promise<boolean> {
    let record: ExperimentEntity;
    if (id === 'new') {
      record = await this._repository.findOne({ name });
    } else {
      record = await this._repository.findOne({ name, id: Not(id) });
    }

    return record !== undefined;
  }
}
