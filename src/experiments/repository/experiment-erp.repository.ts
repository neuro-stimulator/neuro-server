import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentERP, ErpOutput, OutputDependency } from 'diplomka-share';

import { ExperimentErpEntity } from '../type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../type/experiment-erp-output.entity';
import { entityToExperimentErp, experimentErpOutputToEntity, experimentErpToEntity } from '../experiments.mapping';
import { CustomRepository } from './custom.repository';
import { ExperimentErpOutputDependencyEntity } from '../type/experiment-erp-output-dependency.entity';

@EntityRepository()
export class ExperimentErpRepository implements CustomRepository<ExperimentERP> {

  private readonly erpRepository: Repository<ExperimentErpEntity>;
  private readonly erpOutputRepository: Repository<ExperimentErpOutputEntity>;
  private readonly erpOutputDepRepository: Repository<ExperimentErpOutputDependencyEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.erpRepository = _manager.getRepository(ExperimentErpEntity);
    this.erpOutputRepository = _manager.getRepository(ExperimentErpOutputEntity);
    this.erpOutputDepRepository = _manager.getRepository(ExperimentErpOutputDependencyEntity);
  }

  private async _updateOutputDependencies(output: ErpOutput): Promise<any> {
    const outputDependencies: OutputDependency[] = output.dependencies[0];
    const databaseDependencies = this.erpOutputDepRepository.find({where: {sourceOutput: output.id}});
    // TODO aktualizovat závislosti pro daný výstup
  }

  async one(experiment: Experiment): Promise<ExperimentERP> {
    const experimentERP = await this.erpRepository.findOne(experiment.id);
    const outputs = await this.erpOutputRepository.find({where: {experimentId: experiment.id}});
    const dependencies = await this.erpOutputDepRepository.find({where: {experimentId: experiment.id}});

    return entityToExperimentErp(experiment, experimentERP, outputs, dependencies);
  }

  async insert(experiment: ExperimentERP): Promise<any> {
    return this.erpRepository.insert(experimentErpToEntity(experiment));
  }

  async update(experiment: ExperimentERP): Promise<any> {
    await this.erpRepository.update({id: experiment.id}, experimentErpToEntity(experiment));
    for (const output of experiment.outputs) {
      await this.erpOutputRepository.update({id: output.id}, experimentErpOutputToEntity(output));
      await this._updateOutputDependencies(output);
    }
  }

  async delete(id: number): Promise<any> {
    return this.erpRepository.delete({id});
  }

}
