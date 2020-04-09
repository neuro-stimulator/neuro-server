import { Injectable, Logger } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { ValidatorResult } from 'jsonschema';

import { Experiment, ExperimentType} from '@stechy1/diplomka-share';

import { CustomExperimentRepository } from '../share/custom-experiment-repository';
import { SerialService } from '../low-level/serial.service';
import { MessagePublisher } from '../share/utils';
import { EXPERIMENT_DELETE, EXPERIMENT_INSERT, EXPERIMENT_UPDATE } from './experiment.gateway.protocol';
import { ExperimentEntity } from './entity/experiment.entity';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { ExperimentReaRepository } from './repository/experiment-rea.repository';
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
  // public experimentResult: ExperimentResult = null;

  constructor(private readonly serial: SerialService,
              private readonly repository: ExperimentRepository,
              private readonly repositoryERP: ExperimentErpRepository,
              private readonly repositoryCVEP: ExperimentCvepRepository,
              private readonly repositoryFVEP: ExperimentFvepRepository,
              private readonly repositoryTVEP: ExperimentTvepRepository,
              private readonly repositoryREA: ExperimentReaRepository) {
    this._initMapping();
    // this._initSerialListeners();
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
    this.repositoryMapping[ExperimentType.REA] = {
      repository: this.repositoryREA
    };
  }

  // private _initSerialListeners() {
    // this.serial.bindEvent(EventStimulatorState.name, (event) => this._stimulatorStateListener(event));
    // this.serial.bindEvent(EventIOChange.name, (event) => this._ioChangeListener(event));
  // }

  // private _stimulatorStateListener(event: EventStimulatorState) {
  //   if (event.noUpdate) {
  //     return;
  //   }
  //
  //   switch (event.state) {
  //     case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
  //       this.inmemoryDB.records = [];
  //       for (let i = 0; i < this.experimentResult.outputCount; i++) {
  //         const e = {name: 'EventIOChange', ioType: 'output', state: 'off', index: i, timestamp: event.timestamp};
  //         this._ioChangeListener(e as EventIOChange);
  //         this.serial.publishMessage(EXPERIMENT_DATA, e);
  //       }
  //       break;
  //     case CommandFromStimulator.COMMAND_STIMULATOR_STATE_READY:
  //       this.clearRunningExperimentResult();
  //   }
  // }

  // private _ioChangeListener(event: EventIOChange) {
  //   this.inmemoryDB.create({index: event.index, ioType: event.ioType, state: event.state, timestamp: event.timestamp});
  // }

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

  async validateExperiment(experiment: Experiment): Promise<boolean> {
    this.logger.log('Validuji experiment.');
    const result: ValidatorResult = await this.repositoryMapping[experiment.type].repository.validate(experiment);
    this.logger.log(`Je experiment validní: ${result.valid}.`);
    if (!result.valid) {
      this.logger.debug(result.errors);
    }
    return result.valid;
  }

  async nameExists(name: string, id: number|'new'): Promise<boolean> {
    if (id === 'new') {
      this.logger.log(`Testuji, zda-li zadaný název nového experimentu již existuje: ${name}.`);
    } else {
      this.logger.log(`Testuji, zda-li zadaný název pro existující experiment již existuje: ${name}.`);
    }
    const exists = await this.repository.nameExists(name, id);
    this.logger.log(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }

  // public clearRunningExperimentResult() {
  //   this.experimentResult = null;
  // }

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

}
