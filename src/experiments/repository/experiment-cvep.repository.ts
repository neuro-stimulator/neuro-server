import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentCVEP} from 'diplomka-share';

import { CustomRepository } from './custom.repository';
import { ExperimentCvepEntity } from '../type/experiment-cvep.entity';
import { entityToExperimentCvep, experimentCvepToEntity } from '../experiments.mapping';

@EntityRepository()
export class ExperimentCvepRepository implements CustomRepository<ExperimentCVEP> {

  private readonly cvepRepository: Repository<ExperimentCvepEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.cvepRepository = _manager.getRepository(ExperimentCvepEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentCVEP> {
    const experimentCVEP = await this.cvepRepository.findOne(experiment.id);

    return entityToExperimentCvep(experiment, experimentCVEP);
  }

  async insert(experiment: ExperimentCVEP): Promise<any> {
    return this.cvepRepository.insert(experimentCvepToEntity(experiment));
  }

  async update(experiment: ExperimentCVEP): Promise<any> {
    return this.cvepRepository.update({id: experiment.id}, experimentCvepToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this.cvepRepository.delete({ id });
  }

}
