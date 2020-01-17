import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Experiment, ExperimentERP, ErpOutput, OutputDependency } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from '../../share/custom-experiment-repository';
import { ExperimentErpEntity } from '../entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../entity/experiment-erp-output.entity';
import {
  entityToExperimentErp,
  experimentErpOutputDependencyToEntity,
  experimentErpOutputToEntity,
  experimentErpToEntity,
} from '../experiments.mapping';
import { ExperimentErpOutputDependencyEntity } from '../entity/experiment-erp-output-dependency.entity';

@Injectable()
export class ExperimentErpRepository implements CustomExperimentRepository<Experiment, ExperimentERP> {

  private readonly logger: Logger = new Logger(ExperimentErpRepository.name);

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
    const databaseDependencies = await repository.find({ where: { experimentId: output.experimentId, sourceOutput: output.orderId + 1 } });

    for (const databaseDependency of databaseDependencies) {
      databaseDependency.sourceOutput--;
      databaseDependency.destOutput--;
    }

    // 1. Najdu společné experimenty, které pouze aktualizuji
    const intersection = outputDependencies.filter(value => databaseDependencies.findIndex(dependency => value.id === dependency.id) > -1);
    // 2. Najdu ty co přebývají ve vstupu od uživatele = nové závislosti
    const created = outputDependencies.filter(value => !(databaseDependencies.findIndex(dependency => value.id === dependency.id) > -1));
    // 3. Najdu ty, co chybí ve vstupu od uživatele = smazané závislosti
    const deleted = databaseDependencies.filter(value => !(outputDependencies.findIndex(dependency => value.id === dependency.id) > -1));

    // 4. Odstraním ty, co se mají odstranit
    if (deleted.length > 0) {
      this.logger.verbose(`Mažu závislosti: ${deleted.map(value => value.id).join(', ')}`);
      await repository.delete(deleted.map(value => {
        return value.id;
      }));
    }
    // 5. Aktualizuji ty, co se mají aktualizovat
    for (const outputDependency of intersection) {
      this.logger.verbose('Aktualizuji závislost: ');
      this.logger.verbose(experimentErpOutputDependencyToEntity(outputDependency));
      await repository.update(outputDependency.id, experimentErpOutputDependencyToEntity(outputDependency));
    }
    // 6. Založím nové závislosti
    for (const outputDependency of created) {
      outputDependency.id = null;
      this.logger.verbose('Zakládám novou závislost: ');
      this.logger.verbose(experimentErpOutputDependencyToEntity(outputDependency));
      await repository.insert(experimentErpOutputDependencyToEntity(outputDependency));
    }

  }

  async one(experiment: Experiment): Promise<ExperimentERP> {
    const experimentERP = await this.erpRepository.findOne(experiment.id);
    const outputs = await this.erpOutputRepository.find({ where: { experimentId: experiment.id }, skip: 1 });
    const dependencies = await this.erpOutputDepRepository.find({ where: { experimentId: experiment.id }});

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
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const output of experiment.outputs) {
        this.logger.verbose('Aktualizuji výstup experimentu: ');
        this.logger.verbose(experimentErpOutputToEntity(output));
        await erpOutputRepository.update({ id: output.id }, experimentErpOutputToEntity(output));
        await this._updateOutputDependencies(erpOutputDepRepository, output);
      }
      this.logger.verbose('Aktualizuji ERP experiment: ');
      this.logger.verbose(experimentErpToEntity(experiment));
      await erpRepository.update({ id: experiment.id }, experimentErpToEntity(experiment));
    });
  }

  async delete(id: number): Promise<any> {
    return this.erpRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentERP): {audio: {}, image: {}} {
    const multimedia = {
      audio: {},
      image: {}
    };
    for (let i = 0; i < experiment.outputCount; i++) {
      const output = experiment.outputs[i];
      if (output.outputType.audio) {
        multimedia.audio[i] = output.outputType.audioFile;
      }
      if (output.outputType.image) {
        multimedia.image[i] = output.outputType.imageFile;
      }
    }

    return multimedia;
  }

}
