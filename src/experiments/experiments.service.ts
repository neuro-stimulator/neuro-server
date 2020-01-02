import { Injectable, Logger } from '@nestjs/common';
import { getCustomRepository, Repository } from 'typeorm';
import { ExperimentEntity } from './experiment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment, ExperimentResult, ExperimentType, CommandFromStimulator } from 'diplomka-share';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { CustomRepository } from '../share/custom.repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { SerialService } from '../low-level/serial.service';
import { EventIOChange, EventStimulatorState} from '../low-level/protocol/hw-events';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IoEventInmemoryEntity } from './cache/io-event.inmemory.entity';
import { MessagePublisher } from '../share/utils';

@Injectable()
export class ExperimentsService implements MessagePublisher {

  private readonly logger = new Logger(ExperimentsService.name);

  private readonly repositoryERP: ExperimentErpRepository;
  private readonly repositoryCVEP: ExperimentCvepRepository;
  private readonly repositoryFVEP: ExperimentFvepRepository;
  private readonly repositoryTVEP: ExperimentTvepRepository;

  private readonly repositoryMapping: {
    [p: string]: {
      repository: CustomRepository<any, any>,
    },
  } = {};
  private _publishMessage: (topic: string, data: any) => void;
  public experimentResult: ExperimentResult = null;

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
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUN:
        this.inmemoryDB.records = [];
        for (let i = 0; i < this.experimentResult.outputCount; i++) {
          const e = {name: 'EventIOChange', ioType: 'output', state: 'off', index: i, timestamp: event.timestamp};
          this._ioChangeListener(e as EventIOChange);
          this.serial.publishMessage('data', e);
        }
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
    experiment.usedOutputs = {led: true};
    const result = await this.repository.insert(experimentToEntity(experiment));
    experiment.id = result.raw;
    const subresult = await this.repositoryMapping[experiment.type].repository.insert(experiment);

    const finalExperiment = this.byId(experiment.id);
    this._publishMessage('insert', finalExperiment);
    return finalExperiment;
  }

  async update(experiment: Experiment): Promise<Experiment> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji experiment.');
    try {
      const subresult = await this.repositoryMapping[experiment.type].repository.update(experiment);
      const result = await this.repository.update({ id: experiment.id }, experimentToEntity(experiment));
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba.');
      this.logger.error(e.message);
    }

    const finalExperiment = this.byId(experiment.id);
    this._publishMessage('update', finalExperiment);
    return finalExperiment;
  }

  async delete(id: number): Promise<Experiment> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu experiment s id: ${id}`);
    const subresult = await this.repositoryMapping[experiment.type].repository.delete(id);
    const result = await this.repository.delete({ id });

    this._publishMessage('delete', experiment);
    return experiment;
  }

  async usedOutputMultimedia(id: number): Promise<any> {
    const experiment: Experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    return this.repositoryMapping[experiment.type].repository.outputMultimedia(experiment);
  }

  public clearRunningExperimentResult() {
    this.experimentResult = null;
  }

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

}
