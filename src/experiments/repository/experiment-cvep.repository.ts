import { EntityManager, EntityRepository, Repository } from 'typeorm';

import { Experiment, ExperimentCVEP} from '@stechy1/diplomka-share';

import { CustomRepository } from '../../share/custom.repository';
import { ExperimentCvepEntity } from '../entity/experiment-cvep.entity';
import { entityToExperimentCvep, experimentCvepToEntity } from '../experiments.mapping';

@EntityRepository()
export class ExperimentCvepRepository implements CustomRepository<Experiment, ExperimentCVEP> {

  private readonly cvepRepository: Repository<ExperimentCvepEntity>;

  constructor(private readonly _manager: EntityManager) {
    this.cvepRepository = _manager.getRepository(ExperimentCvepEntity);
  }

  async one(experiment: Experiment): Promise<ExperimentCVEP> {
    const experimentCVEP = await this.cvepRepository.findOne(experiment.id);

    return entityToExperimentCvep(experiment, experimentCVEP);
  }

  async insert(experiment: ExperimentCVEP): Promise<any> {
    return this.cvepRepository.insert(experimentCvepToEntity(experiment));
  }

  async update(experiment: ExperimentCVEP): Promise<any> {
    return this.cvepRepository.update({id: experiment.id}, experimentCvepToEntity(experiment));
  }

  async delete(id: number): Promise<any> {
    return this.cvepRepository.delete({ id });
  }

  outputMultimedia(experiment: ExperimentCVEP): {audio: {}, image: {}} {
    const multimedia = {
      audio: {},
      image: {}
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
