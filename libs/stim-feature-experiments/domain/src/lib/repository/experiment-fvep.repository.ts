import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentFVEP, Output } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';
import { entityToExperimentFvep, experimentFvepOutputToEntity, experimentFvepToEntity } from './experiments.mapping';
import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';

@Injectable()
export class ExperimentFvepRepository implements CustomExperimentRepository<Experiment<Output>, ExperimentFVEP> {
  private readonly logger: Logger = new Logger(ExperimentFvepRepository.name);

  private readonly _fvepRepository: Repository<ExperimentFvepEntity>;
  private readonly _fvepOutputRepository: Repository<ExperimentFvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
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
        const entity = experimentFvepOutputToEntity(output)
        this.logger.verbose(JSON.stringify(entity));
        await tvepOutputRepository.update({ id: output.id }, entity);
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

  outputMultimedia(experiment: ExperimentFVEP): ExperimentAssets {
    const multimedia: ExperimentAssets = {
      audio: {},
      image: {},
    };
    for (let i = 0; i < experiment.outputCount; i++) {
      const output = experiment.outputs[i];
      if (output.outputType.audio && output.outputType.audioFile != null) {
        multimedia.audio[i] = output.outputType.audioFile;
      }
      if (output.outputType.image && output.outputType.imageFile != null) {
        multimedia.image[i] = output.outputType.imageFile;
      }
    }

    return multimedia;
  }
}
