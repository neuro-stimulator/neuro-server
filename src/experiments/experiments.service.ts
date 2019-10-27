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
    this.logger.log('Hledám všechny experimenty...');
    const experimentEntities: ExperimentEntity[] = await this.repository.find();
    this.logger.log(`Bylo nalezeno: ${experimentEntities.length} záznamů.`);
    return experimentEntities.map(value => entityToExperiment(value));
  }

  async insert(experiment: Experiment): Promise<Experiment> {
    this.logger.log('Vkládám nový experiment do databáze.');
    return this.repository.insert(experimentToEntity(experiment))
               .then(result => {
                 experiment.id = result.raw;

                 return experiment;
               });
  }

  async update(experiment: Experiment): Promise<Experiment> {
    this.logger.log('Aktualizuji experiment.');
    return this.repository.update({id: experiment.id}, experimentToEntity(experiment))
               .then(result => {
                 return experiment;
               });
  }

  async delete(id: number): Promise<Experiment> {
    this.logger.log(`Mažu experiment s id: ${id}`);
    const experimentEntity = await this.repository.findOne(id);
    return this.repository.delete({id})
               .then(result => {
                 return entityToExperiment(experimentEntity);
               });
  }
}
