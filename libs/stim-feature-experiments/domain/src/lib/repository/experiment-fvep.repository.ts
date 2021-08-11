import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Experiment, ExperimentFVEP, Output } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@diplomka-backend/stim-lib-common';

import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';
import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';
import { BaseExperimentRepository } from './base-experiment-repository';
import { entityToExperimentFvep, experimentFvepOutputToEntity, experimentFvepToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentFvepRepository extends BaseExperimentRepository<Experiment<Output>, ExperimentFVEP> {
  private readonly logger: Logger = new Logger(ExperimentFvepRepository.name);

  private readonly _fvepRepository: Repository<ExperimentFvepEntity>;
  private readonly _fvepOutputRepository: Repository<ExperimentFvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    super();
    this._fvepRepository = _manager.getRepository(ExperimentFvepEntity);
    this._fvepOutputRepository = _manager.getRepository(ExperimentFvepOutputEntity);
  }

  async one(experiment: Experiment<Output>): Promise<ExperimentFVEP | undefined> {
    const experimentFVEP = await this._fvepRepository.findOne(experiment.id);
    if (experimentFVEP === undefined) {
      this.logger.warn(`Experiment FVEP s id: ${experiment.id} nebyl nalezen!`);
      return undefined;
    }

    const outputs = await this._fvepOutputRepository.find({
      where: { experimentId: experiment.id },
    });

    return entityToExperimentFvep(experiment, experimentFVEP, outputs);
  }

  async insert(experiment: ExperimentFVEP): Promise<InsertResult> {
    return this._fvepRepository.insert(experimentFvepToEntity(experiment));
  }

  async update(experiment: ExperimentFVEP, diff: ObjectDiff): Promise<void> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const tvepRepository = transactionManager.getRepository(ExperimentFvepEntity);
      const tvepOutputRepository = transactionManager.getRepository(ExperimentFvepOutputEntity);
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const key of Object.keys(diff['outputs'])) {
        this.logger.verbose(`Aktualizuji ${key}. výstup experimentu: `);
        const output = experiment.outputs[key];
        const outputEntity = experimentFvepOutputToEntity(output)
        this.logger.verbose(JSON.stringify(outputEntity));
        await tvepOutputRepository.update({ id: output.id }, outputEntity);
      }
      this.logger.verbose('Aktualizuji TVEP experiment: ');
      const entity = experimentFvepToEntity(experiment);
      this.logger.verbose(JSON.stringify(entity));
      await tvepRepository.update({ id: experiment.id }, entity);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._fvepRepository.delete({ id });
  }
}
