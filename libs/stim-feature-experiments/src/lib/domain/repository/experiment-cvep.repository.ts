import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

import { EntityManager, Repository } from 'typeorm';
import { Validator, ValidatorResult } from 'jsonschema';

import { Experiment, ExperimentCVEP } from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from './custom-experiment-repository';
import { ExperimentCvepEntity } from '../model/entity/experiment-cvep.entity';
import {
  entityToExperimentCvep,
  experimentCvepToEntity,
} from './experiments.mapping';

@Injectable()
export class ExperimentCvepRepository
  implements CustomExperimentRepository<Experiment, ExperimentCVEP> {
  private static readonly JSON_SCHEMA = JSON.parse(
    fs.readFileSync('apps/server/schemas/experiment-cvep.json', {
      encoding: 'utf-8',
    })
  );

  private readonly _cvepRepository: Repository<ExperimentCvepEntity>;
  private readonly _validator: Validator = new Validator();

  constructor(_manager: EntityManager) {
    this._cvepRepository = _manager.getRepository(ExperimentCvepEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentCVEP> {
    const experimentCVEP = await this._cvepRepository.findOne(experiment.id);

    return entityToExperimentCvep(experiment, experimentCVEP);
  }

  async insert(experiment: ExperimentCVEP): Promise<any> {
    return this._cvepRepository.insert(experimentCvepToEntity(experiment));
  }

  async update(experiment: ExperimentCVEP): Promise<any> {
    return this._cvepRepository.update(
      { id: experiment.id },
      experimentCvepToEntity(experiment)
    );
  }

  async delete(id: number): Promise<any> {
    return this._cvepRepository.delete({ id });
  }

  async validate(record: ExperimentCVEP): Promise<ValidatorResult> {
    return this._validator.validate(
      record,
      ExperimentCvepRepository.JSON_SCHEMA
    );
  }

  outputMultimedia(experiment: ExperimentCVEP): { audio: {}; image: {} } {
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
