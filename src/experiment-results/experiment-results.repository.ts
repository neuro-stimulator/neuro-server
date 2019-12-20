import { ExperimentResult } from 'diplomka-share';

import { CustomRepository } from '../share/custom.repository';

import { ExperimentResultEntity } from './experiment-result.entity';

export class ExperimentResultsRepository implements CustomRepository<ExperimentResult, ExperimentResultEntity> {

  one(experiment: ExperimentResult): Promise<ExperimentResultEntity> {
    return undefined;
  }

  insert(experiment: ExperimentResultEntity): Promise<any> {
    return undefined;
  }

  update(experiment: ExperimentResultEntity): Promise<any> {
    return undefined;
  }

  delete(id: number): Promise<any> {
    return undefined;
  }



}
