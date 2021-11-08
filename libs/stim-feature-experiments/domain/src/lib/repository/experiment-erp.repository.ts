import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { ErpOutput, Experiment, ExperimentERP, ErpOutputDependency, Output } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@neuro-server/stim-lib-common';

import { ExperimentErpEntity } from '../model/entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../model/entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from '../model/entity/experiment-erp-output-dependency.entity';
import { BaseExperimentRepository } from './base-experiment-repository';
import { entityToExperimentErp, experimentErpOutputDependencyToEntity, experimentErpOutputToEntity, experimentErpToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentErpRepository extends BaseExperimentRepository<Experiment<Output>, ExperimentERP> {
  private readonly logger: Logger = new Logger(ExperimentErpRepository.name);

  private readonly _erpRepository: Repository<ExperimentErpEntity>;
  private readonly _erpOutputRepository: Repository<ExperimentErpOutputEntity>;
  private readonly _erpOutputDepRepository: Repository<ExperimentErpOutputDependencyEntity>;

  constructor(private readonly _manager: EntityManager) {
    super();
    this._erpRepository = _manager.getRepository(ExperimentErpEntity);
    this._erpOutputRepository = _manager.getRepository(ExperimentErpOutputEntity);
    this._erpOutputDepRepository = _manager.getRepository(ExperimentErpOutputDependencyEntity);
  }

  private async _updateOutputDependencies(repository: Repository<ExperimentErpOutputDependencyEntity>, output: ErpOutput): Promise<any> {
    const outputDependencies: ErpOutputDependency[] = output.dependencies[0];
    const databaseDependencies = await repository.find({
      where: {
        experimentId: output.experimentId,
        sourceOutput: output.orderId + 1,
      },
    });

    for (const databaseDependency of databaseDependencies) {
      databaseDependency.sourceOutput--;
      databaseDependency.destOutput--;
    }

    // 1. Najdu společné experimenty, které pouze aktualizuji
    const intersection = outputDependencies.filter((value: ErpOutputDependency) => {
      return databaseDependencies.findIndex((dependency: ExperimentErpOutputDependencyEntity) => value.id === dependency.id) > -1;
    });
    // 2. Najdu ty co přebývají ve vstupu od uživatele = nové závislosti
    const createdDependencies = outputDependencies.filter((value: ErpOutputDependency) => {
      return !(databaseDependencies.findIndex((dependency: ExperimentErpOutputDependencyEntity) => value.id === dependency.id) > -1);
    });
    // 3. Najdu ty, co chybí ve vstupu od uživatele = smazané závislosti
    const deleted = databaseDependencies.filter((value: ExperimentErpOutputDependencyEntity) => {
      return !(outputDependencies.findIndex((dependency: ErpOutputDependency) => value.id === dependency.id) > -1);
    });

    // 4. Odstraním ty, co se mají odstranit
    if (deleted.length > 0) {
      this.logger.verbose(`Mažu závislosti: ${deleted.map((value) => value.id).join(', ')}`);
      await repository.delete(
        deleted.map((value) => {
          return value.id;
        })
      );
    }
    // 5. Aktualizuji ty, co se mají aktualizovat
    for (const outputDependency of intersection) {
      this.logger.verbose('Aktualizuji závislost: ');
      this.logger.verbose(experimentErpOutputDependencyToEntity(outputDependency));
      await repository.update(outputDependency.id, experimentErpOutputDependencyToEntity(outputDependency));
    }
    // 6. Založím nové závislosti
    for (const outputDependency of createdDependencies) {
      outputDependency.id = null;
      this.logger.verbose('Zakládám novou závislost: ');
      this.logger.verbose(experimentErpOutputDependencyToEntity(outputDependency));
      await repository.insert(experimentErpOutputDependencyToEntity(outputDependency));
    }
  }

  async one(experiment: Experiment<Output>): Promise<ExperimentERP | undefined> {
    const experimentERP = await this._erpRepository.findOne(experiment.id);
    if (experimentERP === undefined) {
      this.logger.warn(`Experiment ERP s id: ${experiment.id} nebyl nalezen!`);
      return undefined;
    }

    const outputs = await this._erpOutputRepository.find({
      where: { experimentId: experiment.id },
    });
    const dependencies = await this._erpOutputDepRepository.find({
      where: { experimentId: experiment.id },
    });

    return entityToExperimentErp(experiment, experimentERP, outputs, dependencies);
  }

  async insert(experiment: ExperimentERP): Promise<InsertResult> {
    return this._erpRepository.insert(experimentErpToEntity(experiment));
  }

  async update(experiment: ExperimentERP, diff: ObjectDiff): Promise<void> {
    await this._manager.transaction(async (transactionManager) => {
      const erpRepository = transactionManager.getRepository(ExperimentErpEntity);
      const erpOutputRepository = transactionManager.getRepository(ExperimentErpOutputEntity);
      const erpOutputDepRepository = transactionManager.getRepository(ExperimentErpOutputDependencyEntity);
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const key of Object.keys(diff['outputs'])) {
        this.logger.verbose(`Aktualizuji ${key}. výstup experimentu: `);
        const output = experiment.outputs[key];
        const outputEntity = experimentErpOutputToEntity(output);
        this.logger.verbose(JSON.stringify(outputEntity));
        await erpOutputRepository.update({ id: output.id }, outputEntity);
        await this._updateOutputDependencies(erpOutputDepRepository, output);
      }
      this.logger.verbose('Aktualizuji ERP experiment: ');
      const entity = experimentErpToEntity(experiment);
      this.logger.verbose(JSON.stringify(entity));
      await erpRepository.update({ id: experiment.id }, entity);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._erpRepository.delete({ id });
  }
}
