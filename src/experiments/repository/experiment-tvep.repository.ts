import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Experiment, ExperimentTVEP} from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from '../../share/custom-experiment-repository';
import { ExperimentTvepEntity } from '../entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from '../entity/experiment-tvep-output.entity';
import {
  entityToExperimentTvep,
  experimentTvepOutputToEntity,
  experimentTvepToEntity,
} from '../experiments.mapping';
import { Validator, ValidatorResult } from 'jsonschema';

@Injectable()
export class ExperimentTvepRepository implements CustomExperimentRepository<Experiment, ExperimentTVEP> {

  private static readonly JSON_SCHEMA = JSON.parse(fs.readFileSync('schemas/experiment-tvep.json', { encoding: 'utf-8' }));

  private readonly logger: Logger = new Logger(ExperimentTvepRepository.name);
  private readonly _validator: Validator = new Validator();

  private readonly _tvepRepository: Repository<ExperimentTvepEntity>;
  private readonly _tvepOutputRepository: Repository<ExperimentTvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this._tvepRepository = _manager.getRepository(ExperimentTvepEntity);
    this._tvepOutputRepository = _manager.getRepository(ExperimentTvepOutputEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentTVEP> {
    const experimentTVEP = await this._tvepRepository.findOne(experiment.id);
    const outputs = await this._tvepOutputRepository.find({ where: { experimentId: experiment.id } });

    return entityToExperimentTvep(experiment, experimentTVEP, outputs);
  }

  async insert(experiment: ExperimentTVEP): Promise<any> {
    return this._tvepRepository.insert(experimentTvepToEntity(experiment));
  }

  async update(experiment: ExperimentTVEP): Promise<any> {
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

  async delete(id: number): Promise<any> {
    return this._tvepRepository.delete({ id });
  }

  async validate(experiment: ExperimentTVEP): Promise<ValidatorResult> {
    return this._validator.validate(experiment, ExperimentTvepRepository.JSON_SCHEMA);
  }

  outputMultimedia(experiment: ExperimentTVEP): {audio: {}, image: {}} {
    const multimedia = {
      audio: {},
      image: {}
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
