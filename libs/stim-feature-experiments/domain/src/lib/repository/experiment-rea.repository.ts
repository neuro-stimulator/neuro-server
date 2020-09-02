import { Injectable } from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';

import { Experiment, ExperimentAssets, ExperimentREA } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';
import { entityToExperimentRea, experimentReaToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentReaRepository implements CustomExperimentRepository<Experiment, ExperimentREA> {
  private readonly _reaRepository: Repository<ExperimentReaEntity>;

  constructor(_manager: EntityManager) {
    this._reaRepository = _manager.getRepository(ExperimentReaEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentREA> {
    const experimentREA = await this._reaRepository.findOne(experiment.id);

    return entityToExperimentRea(experiment, experimentREA);
  }

  async insert(experiment: ExperimentREA): Promise<any> {
    return this._reaRepository.insert(experimentReaToEntity(experiment));
  }

  async update(experiment: ExperimentREA): Promise<any> {
    return this._reaRepository.update({ id: experiment.id }, experimentReaToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this._reaRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentREA): ExperimentAssets {
    const multimedia: ExperimentAssets = {
      audio: {},
      image: {},
    };
    if (experiment.usedOutputs.audio) {
      multimedia.audio[0] = experiment.usedOutputs.audioFile;
    }
    if (experiment.usedOutputs.image) {
      multimedia.image[0] = experiment.usedOutputs.imageFile;
    }

    return multimedia;
  }
}
