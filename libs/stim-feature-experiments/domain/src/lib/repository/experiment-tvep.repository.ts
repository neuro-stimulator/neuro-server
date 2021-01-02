import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, EntityManager, InsertResult, Repository } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentTVEP, Output } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from '../model/entity/experiment-tvep-output.entity';
import { entityToExperimentTvep, experimentTvepOutputToEntity, experimentTvepToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentTvepRepository implements CustomExperimentRepository<Experiment<Output>, ExperimentTVEP> {
  private readonly logger: Logger = new Logger(ExperimentTvepRepository.name);

  private readonly _tvepRepository: Repository<ExperimentTvepEntity>;
  private readonly _tvepOutputRepository: Repository<ExperimentTvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
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

  async update(experiment: ExperimentTVEP): Promise<void> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const tvepRepository = transactionManager.getRepository(ExperimentTvepEntity);
      const tvepOutputRepository = transactionManager.getRepository(ExperimentTvepOutputEntity);
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const output of experiment.outputs) {
        this.logger.verbose('Aktualizuji výstup experimentu: ');
        this.logger.verbose(experimentTvepOutputToEntity(output));
        await tvepOutputRepository.update({ id: output.id }, experimentTvepOutputToEntity(output));
      }
      this.logger.verbose('Aktualizuji TVEP experiment: ');
      this.logger.verbose(experimentTvepToEntity(experiment));
      await tvepRepository.update({ id: experiment.id }, experimentTvepToEntity(experiment));
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._tvepRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentTVEP): ExperimentAssets {
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
