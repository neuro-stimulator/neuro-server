import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, FindManyOptions, getCustomRepository } from 'typeorm';
import { ExperimentEntity } from './entity/experiment.entity';
import { Experiment, ExperimentResult, ExperimentType, CommandFromStimulator } from '@stechy1/diplomka-share';
import { entityToExperiment, experimentToEntity } from './experiments.mapping';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { CustomExperimentRepository } from '../share/custom-experiment-repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { SerialService } from '../low-level/serial.service';
import { EventIOChange, EventNextSequencePart, EventStimulatorState } from '../low-level/protocol/hw-events';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IoEventInmemoryEntity } from './cache/io-event.inmemory.entity';
import { MessagePublisher } from '../share/utils';
import { EXPERIMENT_DATA, EXPERIMENT_DELETE, EXPERIMENT_INSERT, EXPERIMENT_UPDATE } from './experiment.gateway.protocol';
import { ExperimentRepository } from './repository/experiment.repository';

@Injectable()
export class ExperimentsService implements MessagePublisher {

  private readonly logger = new Logger(ExperimentsService.name);

  private readonly repositoryMapping: {
    [p: string]: {
      repository: CustomExperimentRepository<any, any>,
    },
  } = {};
  private _publishMessage: (topic: string, data: any) => void;
  public experimentResult: ExperimentResult = null;

  constructor(private readonly inmemoryDB: InMemoryDBService<IoEventInmemoryEntity>,
              private readonly serial: SerialService,
              private readonly repository: ExperimentRepository,
              private readonly repositoryERP: ExperimentErpRepository,
              private readonly repositoryCVEP: ExperimentCvepRepository,
              private readonly repositoryFVEP: ExperimentFvepRepository,
              private readonly repositoryTVEP: ExperimentTvepRepository) {
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
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING:
        this.inmemoryDB.records = [];
        for (let i = 0; i < this.experimentResult.outputCount; i++) {
          const e = {name: 'EventIOChange', ioType: 'output', state: 'off', index: i, timestamp: event.timestamp};
          this._ioChangeListener(e as EventIOChange);
          this.serial.publishMessage(EXPERIMENT_DATA, e);
        }
        break;
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY:
        this.experimentResult = null;
    }
  }

  private _ioChangeListener(event: EventIOChange) {
    this.inmemoryDB.create({index: event.index, ioType: event.ioType, state: event.state, timestamp: event.timestamp});
  }

  async findAll(options?: FindManyOptions<ExperimentEntity>): Promise<Experiment[]> {
    this.logger.log(`Hledám všechny experimenty s filtrem: '${JSON.stringify(options ? options.where : {})}'.`);
    const experiments: Experiment[] = await this.repository.all(options);
    this.logger.log(`Bylo nalezeno: ${experiments.length} záznamů.`);
    return experiments;
  }

  async byId(id: number): Promise<Experiment> {
    this.logger.log(`Hledám experiment s id: ${id}`);
    const experiment = await this.repository.one(id);
    if (experiment === undefined) {
      return undefined;
    }
    return this.repositoryMapping[experiment.type].repository.one(experiment);
  }

  async insert(experiment: Experiment): Promise<Experiment> {
    this.logger.log('Vkládám nový experiment do databáze.');
    experiment.usedOutputs = {led: true};
    const result = await this.repository.insert(experiment);
    experiment.id = result.raw;
    const subresult = await this.repositoryMapping[experiment.type].repository.insert(experiment);

    const finalExperiment = await this.byId(experiment.id);
    this._publishMessage(EXPERIMENT_INSERT, finalExperiment);
    return finalExperiment;
  }

  async update(experiment: Experiment): Promise<Experiment> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji experiment.');
    experiment.usedOutputs = experiment.usedOutputs || originalExperiment.usedOutputs;
    try {
      const result = await this.repository.update(experiment);
      const subresult = await this.repositoryMapping[experiment.type].repository.update(experiment);
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba.');
      this.logger.error(e.message);
    }

    const finalExperiment = await this.byId(experiment.id);
    this._publishMessage(EXPERIMENT_UPDATE, finalExperiment);
    return finalExperiment;
  }

  async delete(id: number): Promise<Experiment> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu experiment s id: ${id}`);
    const subresult = await this.repositoryMapping[experiment.type].repository.delete(id);
    const result = await this.repository.delete(id);

    this._publishMessage(EXPERIMENT_DELETE, experiment);
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
