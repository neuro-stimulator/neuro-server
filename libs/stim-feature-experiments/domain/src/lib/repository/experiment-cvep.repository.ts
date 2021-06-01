import { Injectable, Logger } from '@nestjs/common';

import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentCVEP, Output } from '@stechy1/diplomka-share';

import { ObjectDiff } from '@diplomka-backend/stim-lib-common';

import { ExperimentCvepEntity } from '../model/entity/experiment-cvep.entity';
import { ExperimentCvepOutputEntity } from '../model/entity/experiment-cvep-output.entity';
import { CustomExperimentRepository } from './custom-experiment-repository';
import { entityToExperimentCvep, experimentCvepOutputToEntity, experimentCvepToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentCvepRepository implements CustomExperimentRepository<Experiment<Output>, ExperimentCVEP> {
  private readonly logger: Logger = new Logger(ExperimentCvepRepository.name);

  private readonly _cvepRepository: Repository<ExperimentCvepEntity>;
  private readonly _cvepOutputRepository: Repository<ExperimentCvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._cvepRepository = _manager.getRepository(ExperimentCvepEntity);
    this._cvepOutputRepository = _manager.getRepository(ExperimentCvepOutputEntity);
  }

  async one(experiment: Experiment<Output>): Promise<ExperimentCVEP | undefined> {
    const experimentCVEP = await this._cvepRepository.findOne(experiment.id);
    if (experimentCVEP === undefined) {
      this.logger.warn(`Experiment CVEP s id: ${experiment.id} nebyl nalezen!`);
      return undefined;
    }

    const outputs = await this._cvepOutputRepository.find({
      where: { experimentId: experiment.id },
    });

    return entityToExperimentCvep(experiment, experimentCVEP, outputs);
  }

  async insert(experiment: ExperimentCVEP): Promise<InsertResult> {
    return this._cvepRepository.insert(experimentCvepToEntity(experiment));
  }

  async update(experiment: ExperimentCVEP, diff: ObjectDiff): Promise<void> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const cvepRepository = transactionManager.getRepository(ExperimentCvepEntity);
      const cvepOutputRepository = transactionManager.getRepository(ExperimentCvepOutputEntity);
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const key of Object.keys(diff['outputs'])) {
          this.logger.verbose(`Aktualizuji ${key}. výstup experimentu: `);
          const output = experiment.outputs[key];
          const entity = experimentCvepOutputToEntity(output);
          this.logger.verbose(JSON.stringify(entity));
          await cvepOutputRepository.update({ id: output.id }, entity);
      }
      this.logger.verbose('Aktualizuji CVEP experiment: ');
      const entity = experimentCvepToEntity(experiment);
      this.logger.verbose(JSON.stringify(entity));
      await cvepRepository.update({ id: experiment.id }, entity);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._cvepRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentCVEP): ExperimentAssets {
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
