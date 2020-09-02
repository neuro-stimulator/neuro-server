import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentFVEP } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';
import { entityToExperimentFvep, experimentFvepOutputToEntity, experimentFvepToEntity } from './experiments.mapping';
import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';

@Injectable()
export class ExperimentFvepRepository implements CustomExperimentRepository<Experiment, ExperimentFVEP> {
  private readonly logger: Logger = new Logger(ExperimentFvepRepository.name);

  private readonly _fvepRepository: Repository<ExperimentFvepEntity>;
  private readonly _fvepOutputRepository: Repository<ExperimentFvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._fvepRepository = _manager.getRepository(ExperimentFvepEntity);
    this._fvepOutputRepository = _manager.getRepository(ExperimentFvepOutputEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentFVEP> {
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

  async insert(experiment: ExperimentFVEP): Promise<any> {
    return this._fvepRepository.insert(experimentFvepToEntity(experiment));
  }

  async update(experiment: ExperimentFVEP): Promise<any> {
    await this._manager.transaction(async (transactionManager: EntityManager) => {
      const tvepRepository = transactionManager.getRepository(ExperimentFvepEntity);
      const tvepOutputRepository = transactionManager.getRepository(ExperimentFvepOutputEntity);
      this.logger.verbose('Aktualizuji výstupy experimentu...');
      for (const output of experiment.outputs) {
        this.logger.verbose('Aktualizuji výstup experimentu: ');
        this.logger.verbose(experimentFvepOutputToEntity(output));
        await tvepOutputRepository.update({ id: output.id }, experimentFvepOutputToEntity(output));
      }
      this.logger.verbose('Aktualizuji TVEP experiment: ');
      this.logger.verbose(experimentFvepToEntity(experiment));
      await tvepRepository.update({ id: experiment.id }, experimentFvepToEntity(experiment));
    });
  }

  async delete(id: number): Promise<any> {
    return this._fvepRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentFVEP): ExperimentAssets {
    const multimedia: ExperimentAssets = {
      audio: {},
      image: {},
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
