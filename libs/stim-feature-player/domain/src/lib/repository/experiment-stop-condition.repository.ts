import { EntityManager, EntityRepository, InsertResult, Repository } from 'typeorm';

import { ExperimentStopConditionType, ExperimentType } from '@stechy1/diplomka-share';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';
import { entityToExperimentStopConditionType, experimentStopConditionTypeToEntity } from './experiment-stop-condition.mapping';

@EntityRepository()
export class ExperimentStopConditionRepository {
  private readonly _repository: Repository<ExperimentStopConditionEntity>;

  constructor(_manager: EntityManager) {
    this._repository = _manager.getRepository(ExperimentStopConditionEntity);
  }

  async byExperimentType(experimentType: ExperimentType): Promise<ExperimentStopConditionType[]> {
    const experimentStopConditionEntities: ExperimentStopConditionEntity[] = await this._repository.find({ where: { experimentType: ExperimentType[experimentType] } });

    return experimentStopConditionEntities.map((value: ExperimentStopConditionEntity) => entityToExperimentStopConditionType(value));
  }

  async insert(experimentType: ExperimentType, stopCondition: ExperimentStopConditionType): Promise<InsertResult> {
    return this._repository.insert(experimentStopConditionTypeToEntity(experimentType, stopCondition));
  }
}
