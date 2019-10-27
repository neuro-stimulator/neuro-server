import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment } from 'diplomka-share';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';

@Injectable()
export class ExperimentsService {

  private readonly logger = new Logger(ExperimentsService.name);

  constructor(@InjectRepository(ExperimentEntity)
              private readonly repository: Repository<ExperimentEntity>) {
  }

  async findAll(): Promise<Experiment[]> {
    const experimentEntities: ExperimentEntity[] = await this.repository.find();
    return experimentEntities.map(value => entityToExperiment(value));
  }

  async insert(experiment: Experiment): Promise<Experiment> {
    return this.repository.insert(experimentToEntity(experiment))
               .then(result => {
                 experiment.id = result.raw;

                 return experiment;
               });
  }
}
