import { Injectable, Logger } from '@nestjs/common';
import { getCustomRepository, Repository } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment, ExperimentERP, ExperimentType } from 'diplomka-share';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { CustomRepository } from './repository/custom.repository';
import { SerialService } from '../low-level/serial.service';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';

@Injectable()
export class ExperimentsService {

  private readonly logger = new Logger(ExperimentsService.name);

  private readonly repositoryERP: ExperimentErpRepository;
  private readonly repositoryCVEP: ExperimentCvepRepository;
  private readonly repositoryFVEP: ExperimentFvepRepository;
  private readonly repositoryTVEP: ExperimentTvepRepository;

  private readonly repositoryMapping: {
    [p: string]: {
      repository: CustomRepository<any>,
    },
  } = {};

  constructor(@InjectRepository(ExperimentEntity)
              private readonly repository: Repository<ExperimentEntity>,
              private readonly serialService: SerialService) {
    this.repositoryERP = getCustomRepository(ExperimentErpRepository);
    this.repositoryCVEP = getCustomRepository(ExperimentCvepRepository);
    this.repositoryFVEP = getCustomRepository(ExperimentFvepRepository);
    this.repositoryTVEP = getCustomRepository(ExperimentTvepRepository);
    this._initMapping();
  }

  private _initMapping() {
    this.repositoryMapping[ExperimentType.ERP] = {
      repository: this.repositoryERP
    };
    this.repositoryMapping[ExperimentType.CVEP] = {
      repository: this.repositoryCVEP
    };
    this.repositoryMapping[ExperimentType.FVEP] = {
      repository: this.repositoryFVEP
    };
    this.repositoryMapping[ExperimentType.TVEP] = {
      repository: this.repositoryTVEP
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
    return this.repositoryMapping[experiment.type].repository.one(experiment);
  }

  async insert(experiment: Experiment): Promise<Experiment> {
    this.logger.log('Vkládám nový experiment do databáze.');
    const result = await this.repository.insert(experimentToEntity(experiment));
    experiment.id = result.raw;
    const subresult = await this.repositoryMapping[experiment.type].repository.insert(experiment);

    return this.byId(experiment.id);
  }

  async update(experiment: Experiment): Promise<Experiment> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji experiment.');
    const result = await this.repository.update({ id: experiment.id }, experimentToEntity(experiment));
    try {
      const subresult = await this.repositoryMapping[experiment.type].repository.update(experiment);
    } catch (e) {
      this.logger.error('Nastale neočekávaná chyba.');
      this.logger.error(e.message);
    }

    return this.byId(experiment.id);
  }

  async delete(id: number): Promise<Experiment> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu experiment s id: ${id}`);
    const subresult = await this.repositoryMapping[experiment.type].repository.delete(id);
    const result = await this.repository.delete({ id });

    return experiment;
  }

  async install(id: number, sequence: number[]) {
    this.logger.log(`Začínám nahrávat data experimentu do stimulátoru...`);
    const experiment = await this.byId(id);
    // TODO rozlišit experimenty
    const erp = experiment as ExperimentERP;
    for (let i = 0; i < erp.outputCount; i++) {
      this.logger.verbose(`Nahrávám informace o: ${i}. výstupu.`);
      const output = erp.outputs[i];
      const buffer = Buffer.from([0x04, i, output.pulseUp, output.pulseDown, output.brightness, SerialService.DELIMITER]);
      this.serialService.write(buffer);
    }
  }
}
