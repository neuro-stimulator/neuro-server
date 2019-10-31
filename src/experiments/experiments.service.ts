import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment, ExperimentERP, ExperimentType } from 'diplomka-share';
import { entityToExperiment, entityToExperimentErp, experimentErpToEntity, experimentToEntity } from './experiments.mapping';
import { ExperimentErpEntity } from './type/experiment-erp.entity';

@Injectable()
export class ExperimentsService {

  private readonly logger = new Logger(ExperimentsService.name);

  private readonly repositoryMapping: {
    [p: string]: {
      repository: Repository<any>,
      toEntity: (experiment: Experiment) => any,
      fromEntity: (experiment: Experiment, entity: any) => any},
  } = {};

  constructor(@InjectRepository(ExperimentEntity)
              private readonly repository: Repository<ExperimentEntity>,
              @InjectRepository(ExperimentErpEntity)
              private readonly repositoryERP: Repository<ExperimentErpEntity>) {
    this._initMapping();
  }

  private _initMapping() {
    this.repositoryMapping[ExperimentType.ERP] = {
      repository: this.repositoryERP,
      toEntity: experimentErpToEntity,
      fromEntity: entityToExperimentErp,
    };
  }

  async findAll(): Promise<Experiment[]> {
    this.logger.log('Hledám všechny experimenty...');
    const experimentEntities: ExperimentEntity[] = await this.repository.find();
    this.logger.log(`Bylo nalezeno: ${experimentEntities.length} záznamů.`);
    return experimentEntities.map(value => entityToExperiment(value));
  }

  async byId(id: number): Promise<Experiment> {
    this.logger.log(`Hledám experiment s id: ${id}`);
    const experimentEntity: ExperimentEntity = await this.repository.findOne(id);
    if (experimentEntity === undefined) {
      return undefined;
    }

    const experiment = entityToExperiment(experimentEntity);
    const experimentByType = await this.repositoryMapping[experiment.type].repository.findOne(experiment.id);
    return this.repositoryMapping[experiment.type].fromEntity(experiment, experimentByType);
  }

  async insert(experiment: Experiment): Promise<Experiment> {
    this.logger.log('Vkládám nový experiment do databáze.');
    const result = await this.repository.insert(experimentToEntity(experiment));
    experiment.id = result.raw;
    const subresult = await this.repositoryMapping[experiment.type].repository.insert(this.repositoryMapping[experiment.type].toEntity(experiment));

    return experiment;
  }

  async update(experiment: Experiment): Promise<Experiment> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji experiment.');
    const result = await this.repository.update({id: experiment.id}, experimentToEntity(experiment));
    const subresult = await this.repositoryMapping[experiment.type].repository.update(experiment.id, this.repositoryMapping[experiment.type].toEntity(experiment));

    return experiment;
  }

  async delete(id: number): Promise<Experiment> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu experiment s id: ${id}`);
    const subresult = await this.repositoryMapping[experiment.type].repository.delete(id);
    const result = await this.repository.delete({id});

    return experiment;
  }
}
