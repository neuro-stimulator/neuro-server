import { Injectable, Logger } from '@nestjs/common';
import { getCustomRepository, Repository } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment, ExperimentType } from 'diplomka-share';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { CustomRepository } from './repository/custom.repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { SerialService } from '../low-level/serial.service';
import { EventIOChange, EventStimulatorState } from '../low-level/protocol/hw-events';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IoEventInmemoryEntity } from './cache/io-event.inmemory.entity';
import { COMMAND_MANAGE_EXPERIMENT_RUN } from '../commands/protocol/commands.protocol';

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
              private readonly inmemoryDB: InMemoryDBService<IoEventInmemoryEntity>,
              private readonly serial: SerialService) {
    this.repositoryERP = getCustomRepository(ExperimentErpRepository);
    this.repositoryCVEP = getCustomRepository(ExperimentCvepRepository);
    this.repositoryFVEP = getCustomRepository(ExperimentFvepRepository);
    this.repositoryTVEP = getCustomRepository(ExperimentTvepRepository);
    this._initMapping();
    this._initSerialListeners();
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

  private _initSerialListeners() {
    this.serial.bindEvent(EventStimulatorState.name, (event) => this._stimulatorStateListener(event));
    this.serial.bindEvent(EventIOChange.name, (event) => this._ioChangeListener(event));
  }

  private _stimulatorStateListener(event: EventStimulatorState) {
    switch (event.state) {
      case COMMAND_MANAGE_EXPERIMENT_RUN:
        this.inmemoryDB.records = [];
        break;
    }
  }

  private _ioChangeListener(event: EventIOChange) {
    this.inmemoryDB.create({index: event.index, ioType: event.ioType, state: event.state, timestamp: event.timestamp});
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


}
