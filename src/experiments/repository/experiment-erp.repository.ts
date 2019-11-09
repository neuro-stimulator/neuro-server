import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentERP, ErpOutput, OutputDependency } from 'diplomka-share';

import { ExperimentErpEntity } from '../type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../type/experiment-erp-output.entity';
import {
  entityToExperimentErp,
  experimentErpOutputDependencyToEntity,
  experimentErpOutputToEntity,
  experimentErpToEntity,
} from '../experiments.mapping';
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

  private async _updateOutputDependencies(repository: Repository<ExperimentErpOutputDependencyEntity>, output: ErpOutput): Promise<any> {
    const outputDependencies: OutputDependency[] = output.dependencies[0];
    const databaseDependencies = await repository.find({where: {sourceOutput: output.id}});

    // 1. Najdu společné experimenty, které pouze aktualizuji
    const intersection = outputDependencies.filter(value => databaseDependencies.includes(value));
    // 2. Najdu ty co přebývají ve vstupu od uživatele = nové závislosti
    const created = outputDependencies.filter(value => !databaseDependencies.includes(value));
    // 3. Najdu ty, co chybí ve vstupu od uživatele = smazané závislosti
    const deleted = databaseDependencies.filter(value => !outputDependencies.includes(value));

    // 4. Odstraním ty, co se mají odstranit
    if (deleted.length > 0) {
      await repository.delete(deleted.map(value => {
        return value.id;
      }));
    }
    // 5. Aktualizuji ty, co se mají aktualizovat
    for (const outputDependency of intersection) {
      await repository.update(outputDependency.id, experimentErpOutputDependencyToEntity(outputDependency));
    }
    // 6. Založím nové závislosti
    for (const outputDependency of created) {
      outputDependency.id = null;
      await repository.insert(experimentErpOutputDependencyToEntity(outputDependency));
    }

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
    await this._manager.transaction(async transactionManager => {
      const erpRepository = transactionManager.getRepository(ExperimentErpEntity);
      const erpOutputRepository = transactionManager.getRepository(ExperimentErpOutputEntity);
      const erpOutputDepRepository = transactionManager.getRepository(ExperimentErpOutputDependencyEntity);
      await erpRepository.update({id: experiment.id}, experimentErpToEntity(experiment));
      for (const output of experiment.outputs) {
        await erpOutputRepository.update({id: output.id}, experimentErpOutputToEntity(output));
        await this._updateOutputDependencies(erpOutputDepRepository, output);
      }
    });
  }

  async delete(id: number): Promise<any> {
    return this.erpRepository.delete({id});
  }

}
