import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentTVEP, Output } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@neuro-server/stim-lib-common';

import { ExperimentTvepOutputEntity } from '../model/entity/experiment-tvep-output.entity';
import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';

import { BaseExperimentRepository } from './base-experiment-repository';
import { entityToExperimentTvep, experimentTvepOutputToEntity, experimentTvepToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentTvepRepository extends BaseExperimentRepository<Experiment<Output>, ExperimentTVEP> {
  private readonly logger: Logger = new Logger(ExperimentTvepRepository.name);

  private readonly _tvepRepository: Repository<ExperimentTvepEntity>;
  private readonly _tvepOutputRepository: Repository<ExperimentTvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    super();
    this._tvepRepository = _manager.getRepository(ExperimentTvepEntity);
    this._tvepOutputRepository = _manager.getRepository(ExperimentTvepOutputEntity);
  }

  async one(experiment: Experiment<Output>): Promise<ExperimentTVEP | undefined> {
    const experimentTVEP = await this._tvepRepository.findOne(experiment.id);
    if (experimentTVEP === undefined) {
      this.logger.warn(`Experiment TVEP s id: ${experiment.id} nebyl nalezen!`);
      return undefined;
    }

    const outputs = await this._tvepOutputRepository.find({
      where: { experimentId: experiment.id },
    });

    return entityToExperimentTvep(experiment, experimentTVEP, outputs);
  }

  async insert(experiment: ExperimentTVEP): Promise<InsertResult> {
    return this._tvepRepository.insert(experimentTvepToEntity(experiment));
  }

  async update(experiment: ExperimentTVEP, diff: ObjectDiff): Promise<void> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const tvepRepository = transactionManager.getRepository(ExperimentTvepEntity);
      const tvepOutputRepository = transactionManager.getRepository(ExperimentTvepOutputEntity);
      if (diff['outputs']) {
        this.logger.verbose('Aktualizuji výstupy experimentu...');
        this.logger.verbose('Aktualizuji výstupy experimentu...');
        for (const key of Object.keys(diff['outputs'])) {
          this.logger.verbose(`Aktualizuji ${key}. výstup experimentu: `);
          const output = experiment.outputs[key];
          const outputEntity = experimentTvepOutputToEntity(output);
          this.logger.verbose(JSON.stringify(outputEntity));
          await tvepOutputRepository.update({ id: output.id }, outputEntity);
        }
      }
      this.logger.verbose('Aktualizuji TVEP experiment: ');
      const entity = experimentTvepToEntity(experiment);
      this.logger.verbose(JSON.stringify(entity));
      await tvepRepository.update({ id: experiment.id }, entity);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._tvepRepository.delete({ id });
  }
}
