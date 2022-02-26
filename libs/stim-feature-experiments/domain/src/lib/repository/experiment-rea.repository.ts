import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentREA, Output } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@neuro-server/stim-lib-common';

import { ExperimentReaOutputEntity } from '../model/entity/experiment-rea-output.entity';
import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';

import { BaseExperimentRepository } from './base-experiment-repository';
import { entityToExperimentRea, experimentReaOutputToEntity, experimentReaToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentReaRepository extends BaseExperimentRepository<Experiment<Output>, ExperimentREA> {
  private readonly logger: Logger = new Logger(ExperimentReaRepository.name);

  private readonly _reaRepository: Repository<ExperimentReaEntity>;
  private readonly _reaOutputRepository: Repository<ExperimentReaOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    super();
    this._reaRepository = _manager.getRepository(ExperimentReaEntity);
    this._reaOutputRepository = _manager.getRepository(ExperimentReaOutputEntity);
  }

  async one(experiment: Experiment<Output>): Promise<ExperimentREA | undefined> {
    const experimentREA = await this._reaRepository.findOne(experiment.id);
    if (experimentREA === undefined) {
      this.logger.warn(`Experiment REA s id: ${experiment.id} nebyl nalezen!`);
      return undefined;
    }
    const outputs = await this._reaOutputRepository.find({
      where: { experimentId: experiment.id },
    });

    return entityToExperimentRea(experiment, experimentREA, outputs);
  }

  async insert(experiment: ExperimentREA): Promise<InsertResult> {
    return this._reaRepository.insert(experimentReaToEntity(experiment));
  }

  async update(experiment: ExperimentREA, diff: ObjectDiff): Promise<void> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const tvepRepository = transactionManager.getRepository(ExperimentReaEntity);
      const tvepOutputRepository = transactionManager.getRepository(ExperimentReaOutputEntity);
      if (diff['outputs']) {
        this.logger.verbose('Aktualizuji výstupy experimentu...');
        this.logger.verbose('Aktualizuji výstupy experimentu...');
        for (const key of Object.keys(diff['outputs'])) {
          this.logger.verbose(`Aktualizuji ${key}. výstup experimentu: `);
          const output = experiment.outputs[key];
          const outputEntity = experimentReaOutputToEntity(output);
          this.logger.verbose(outputEntity);
          await tvepOutputRepository.update({ id: output.id }, outputEntity);
        }
      }
      this.logger.verbose('Aktualizuji TVEP experiment: ');
      const entity = experimentReaToEntity(experiment);
      this.logger.verbose(JSON.stringify(entity));
      await tvepRepository.update({ id: experiment.id }, entity);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._reaRepository.delete({ id });
  }
}
