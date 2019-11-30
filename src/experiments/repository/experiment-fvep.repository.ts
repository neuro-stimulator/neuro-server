import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentFVEP} from 'diplomka-share';

import { CustomRepository } from './custom.repository';
import { ExperimentFvepEntity } from '../type/experiment-fvep.entity';
import { entityToExperimentFvep, experimentFvepToEntity } from '../experiments.mapping';
@EntityRepository()
export class ExperimentFvepRepository implements CustomRepository<ExperimentFVEP> {

  private readonly fvepRepository: Repository<ExperimentFvepEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.fvepRepository = _manager.getRepository(ExperimentFvepEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentFVEP> {
    const experimentFVEP = await this.fvepRepository.findOne(experiment.id);

    return entityToExperimentFvep(experiment, experimentFVEP);
  }

  async insert(experiment: ExperimentFVEP): Promise<any> {
    return this.fvepRepository.insert(experimentFvepToEntity(experiment));
  }

  async update(experiment: ExperimentFVEP): Promise<any> {
    return this.fvepRepository.update({id: experiment.id}, experimentFvepToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this.fvepRepository.delete({ id });
  }

}
