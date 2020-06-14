import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';
import { Validator, ValidatorResult } from 'jsonschema';

import { Experiment, ExperimentREA } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';
import {
  entityToExperimentRea,
  experimentReaToEntity,
} from './experiments.mapping';

@Injectable()
export class ExperimentReaRepository
  implements CustomExperimentRepository<Experiment, ExperimentREA> {
  private static readonly JSON_SCHEMA = JSON.parse(
    fs.readFileSync('apps/server/schemas/experiment-rea.json', {
      encoding: 'utf-8',
    })
  );

  private readonly _reaRepository: Repository<ExperimentReaEntity>;
  private readonly _validator: Validator = new Validator();

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
    return this._reaRepository.update(
      { id: experiment.id },
      experimentReaToEntity(experiment)
    );
  }

  async delete(id: number): Promise<any> {
    return this._reaRepository.delete({ id });
  }

  async validate(record: ExperimentREA): Promise<ValidatorResult> {
    return this._validator.validate(
      record,
      ExperimentReaRepository.JSON_SCHEMA
    );
  }

  outputMultimedia(experiment: ExperimentREA): { audio: {}; image: {} } {
    const multimedia = {
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
