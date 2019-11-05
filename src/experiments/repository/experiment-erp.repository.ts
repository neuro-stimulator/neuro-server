import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentERP} from 'diplomka-share';

import { ExperimentErpEntity } from '../type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../type/experiment-erp-output.entity';
import { entityToExperimentErp, experimentErpOutputToEntity, experimentErpToEntity } from '../experiments.mapping';
import { CustomRepository } from './custom.repository';

@EntityRepository()
export class ExperimentErpRepository implements CustomRepository<ExperimentERP> {

  private readonly erpRepository: Repository<ExperimentErpEntity>;
  private readonly erpOutputRepository: Repository<ExperimentErpOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.erpRepository = _manager.getRepository(ExperimentErpEntity);
    this.erpOutputRepository = _manager.getRepository(ExperimentErpOutputEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentERP> {
    const experimentERP = await this.erpRepository.findOne(experiment.id);
    const outputs = await this.erpOutputRepository.find({where: {experimentId: experiment.id}});

    return entityToExperimentErp(experiment, experimentERP, outputs);
  }

  async insert(experiment: ExperimentERP): Promise<any> {
    return this.erpRepository.insert(experimentErpToEntity(experiment));
  }

  async update(experiment: ExperimentERP): Promise<any> {
    await this.erpRepository.update({id: experiment.id}, experimentErpToEntity(experiment));
    for (const output of experiment.outputs) {
      await this.erpOutputRepository.update({id: output.id}, experimentErpOutputToEntity(output));
    }
  }

  async delete(id: number): Promise<any> {
    return this.erpRepository.delete({id});
  }

}
