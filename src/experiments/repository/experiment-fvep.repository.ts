import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentFVEP} from 'diplomka-share';

import { CustomRepository } from '../../share/custom.repository';
import { ExperimentFvepEntity } from '../type/experiment-fvep.entity';
import { entityToExperimentFvep, experimentFvepToEntity, experimentFvepOutputToEntity } from '../experiments.mapping';
import { Logger } from '@nestjs/common';
import { ExperimentFvepOutputEntity } from '../type/experiment-fvep-output.entity';
@EntityRepository()
export class ExperimentFvepRepository implements CustomRepository<Experiment, ExperimentFVEP> {

  private readonly logger: Logger = new Logger(ExperimentFvepRepository.name);

  private readonly fvepRepository: Repository<ExperimentFvepEntity>;
  private readonly fvepOutputRepository: Repository<ExperimentFvepOutputEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.fvepRepository = _manager.getRepository(ExperimentFvepEntity);
    this.fvepOutputRepository = _manager.getRepository(ExperimentFvepOutputEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentFVEP> {
    const experimentFVEP = await this.fvepRepository.findOne(experiment.id);
    const outputs = await this.fvepOutputRepository.find({where: {experimentId: experiment.id } });

    return entityToExperimentFvep(experiment, experimentFVEP, outputs);
  }

  async insert(experiment: ExperimentFVEP): Promise<any> {
    return this.fvepRepository.insert(experimentFvepToEntity(experiment));
  }

  async update(experiment: ExperimentFVEP): Promise<any> {
      await this._manager.transaction(async transactionManager => {
        const tvepRepository = transactionManager.getRepository(ExperimentFvepEntity);
        const tvepOutputRepository = transactionManager.getRepository(ExperimentFvepOutputEntity);
        this.logger.verbose('Aktualizuji TVEP experiment: ');
        this.logger.verbose(experimentFvepToEntity(experiment));
        await tvepRepository.update({ id: experiment.id }, experimentFvepToEntity(experiment));
        for (const output of experiment.outputs) {
          this.logger.verbose('Aktualizuji výstup experimentu: ');
          this.logger.verbose(experimentFvepOutputToEntity(output));
          await tvepOutputRepository.update({ id: output.id }, experimentFvepOutputToEntity(output));
        }
      });
  }

  async delete(id: number): Promise<any> {
    return this.fvepRepository.delete({ id });
  }

}
