import { Logger } from '@nestjs/common';
import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentTVEP} from '@stechy1/diplomka-share';

import { CustomRepository } from '../../share/custom.repository';
import { ExperimentTvepEntity } from '../type/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from '../type/experiment-tvep-output.entity';
import {
  entityToExperimentTvep,
  experimentTvepOutputToEntity,
  experimentTvepToEntity,
} from '../experiments.mapping';

@EntityRepository()
export class ExperimentTvepRepository implements CustomRepository<Experiment, ExperimentTVEP> {

  private readonly logger: Logger = new Logger(ExperimentTvepRepository.name);

  private readonly tvepRepository: Repository<ExperimentTvepEntity>;
  private readonly tvepOutputRepository: Repository<ExperimentTvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.tvepRepository = _manager.getRepository(ExperimentTvepEntity);
    this.tvepOutputRepository = _manager.getRepository(ExperimentTvepOutputEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentTVEP> {
    const experimentTVEP = await this.tvepRepository.findOne(experiment.id);
    const outputs = await this.tvepOutputRepository.find({ where: { experimentId: experiment.id } });

    return entityToExperimentTvep(experiment, experimentTVEP, outputs);
  }

  async insert(experiment: ExperimentTVEP): Promise<any> {
    return this.tvepRepository.insert(experimentTvepToEntity(experiment));
  }

  async update(experiment: ExperimentTVEP): Promise<any> {
    await this._manager.transaction(async transactionManager => {
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
    return this.tvepRepository.delete({ id });
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
