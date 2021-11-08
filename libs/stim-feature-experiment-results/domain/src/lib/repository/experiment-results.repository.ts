import { EntityManager, EntityRepository, Not, Repository, SelectQueryBuilder, DeleteResult } from 'typeorm';

import { ExperimentResult } from '@stechy1/diplomka-share';

import { BaseRepository } from '@neuro-server/stim-lib-common';

import { ExperimentResultEntity } from '../model/entity/experiment-result.entity';
import { entityToExperimentResult, experimentResultToEntity } from './experiment-results.mapping';
import { ExperimentResultFindOptions } from './experiment-result.find-options';

@EntityRepository()
export class ExperimentResultsRepository extends BaseRepository {

  private static readonly ALIAS = 'experimentResult';

  private readonly _repository: Repository<ExperimentResultEntity>;

  constructor(_manager: EntityManager) {
    super();
    this._repository = _manager.getRepository(ExperimentResultEntity);
  }

  protected prepareFindQuery(findOptions: ExperimentResultFindOptions): SelectQueryBuilder<ExperimentResultEntity> {
    const query = this._repository
                      .createQueryBuilder(ExperimentResultsRepository.ALIAS)
                      .leftJoinAndSelect(`${ExperimentResultsRepository.ALIAS}.userGroups`, 'userGroup');

    if (findOptions.userGroups !== undefined) {
      query.where('userGroup.id IN (:...groups)', { groups: findOptions.userGroups });
    }

    if (findOptions.optionalOptions) {
      super.addFindOptions(query, findOptions.optionalOptions, ExperimentResultsRepository.ALIAS);
    }

    return query;
  }

  async all(findOptions: ExperimentResultFindOptions): Promise<ExperimentResult[]> {
    const query = this.prepareFindQuery(findOptions);

    const experimentResultEntities: ExperimentResultEntity[] = await query.getMany();

    return experimentResultEntities.map((value: ExperimentResultEntity) => entityToExperimentResult(value));
  }

  async one(findOptions: ExperimentResultFindOptions): Promise<ExperimentResult | undefined> {
    const query = this.prepareFindQuery(findOptions);

    const experimentResultEntity: ExperimentResultEntity = await query.getOne();

    if (experimentResultEntity === undefined) {
      return undefined;
    }

    return entityToExperimentResult(experimentResultEntity);
  }

  async insert(experiment: ExperimentResult, userId: number): Promise<ExperimentResult> {
    const entity: ExperimentResultEntity = experimentResultToEntity(experiment);
    entity.userId = userId;

    return entityToExperimentResult(await this._repository.save(entity));
  }

  async update(experiment: ExperimentResult): Promise<ExperimentResult> {
    const resultExperimentEntity = await this._repository.save(experimentResultToEntity(experiment))
    return entityToExperimentResult(resultExperimentEntity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._repository.delete({ id });
  }

  async nameExists(name: string, id: number): Promise<boolean> {
    const record = await this._repository.findOne({ name, id: Not(id) });
    return record !== undefined;
  }
}
