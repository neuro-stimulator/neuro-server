import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { EntityManager} from 'typeorm';
import { Validator, ValidatorResult } from 'jsonschema';

import { ExperimentResult, CommandFromStimulator } from '@stechy1/diplomka-share';

import { SerialService } from '../low-level/serial.service';
import { EventStimulatorState } from '../low-level/protocol/hw-events';
import { IoEventInmemoryEntity } from '../experiments/cache/io-event.inmemory.entity';
import { ExperimentsService } from '../experiments/experiments.service';
import { FileBrowserService } from '../file-browser/file-browser.service';
import { MessagePublisher } from '../share/utils';
import { EXPERIMENT_RESULT_DELETE, EXPERIMENT_RESULT_INSERT, EXPERIMENT_RESULT_UPDATE } from './experiment-results.gateway.protocol';
import { ExperimentResultsRepository } from './repository/experiment-results.repository';

@Injectable()
export class ExperimentResultsService implements MessagePublisher {

  private static readonly EXPERIMENT_RESULTS_DIRECTORY = `${FileBrowserService.mergePrivatePath('experiment-results')}`;
  private static readonly JSON_SCHEMA = JSON.parse(fs.readFileSync('schemas/experiment-result.json', { encoding: 'utf-8' }));

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly repository: ExperimentResultsRepository;
  private readonly validator: Validator = new Validator();

  private _publishMessage: (topic: string, data: any) => void;

  constructor(private readonly inmemoryDB: InMemoryDBService<IoEventInmemoryEntity>,
              private readonly serial: SerialService,
              private readonly experiments: ExperimentsService,
              _manager: EntityManager) {
    this.repository = _manager.getCustomRepository(ExperimentResultsRepository);
    this._initSerialListeners();
    this._initExperimentResultsDirectory();
  }

  private _initSerialListeners() {
    this.serial.bindEvent(EventStimulatorState.name, (event) => this._stimulatorStateListener(event));
  }

  private _initExperimentResultsDirectory() {
    if (!fs.existsSync(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY)) {
      this.logger.log(`Inicializuji složku s výsledky experimentů: ${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY}`);
      fs.mkdirSync(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY);
    }
  }

  private _stimulatorStateListener(event: EventStimulatorState) {
    switch (event.state) {
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
        this.logger.log(`Experient byl úspěšně ukončen s delkou dat: ${this.inmemoryDB.records.length}`);
        const experimentResult = this.experiments.experimentResult;
        const experimentData = this.inmemoryDB.records;
        const stream = fs.createWriteStream(path.join(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY, experimentResult.filename));
        const success = stream.write(JSON.stringify(experimentData));
        stream.close();
        if (!success) {
          this.logger.error('Data experimentu se nepodařilo zapsat do souboru!');
        }
        this.insert(experimentResult).finally();
        this.experiments.clearRunningExperimentResult();
        break;
    }
  }

  async findAll(): Promise<ExperimentResult[]> {
    this.logger.log('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this.repository.all();
    this.logger.log(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  async byId(id: number): Promise<ExperimentResult> {
    this.logger.log(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this.repository.one(id);
    if (experimentResult === undefined) {
      return undefined;
    }
    return experimentResult;
  }

  async insert(experimentResult: ExperimentResult): Promise<ExperimentResult> {
    this.logger.log('Vkládám nový výsledek experimentu do databáze.');
    const result = await this.repository.insert(experimentResult);
    experimentResult.id = result.raw;

    const finalExperiment = await this.byId(experimentResult.id);
    this._publishMessage(EXPERIMENT_RESULT_INSERT, finalExperiment);
    return finalExperiment;
  }

  async update(experimentResult: ExperimentResult): Promise<ExperimentResult> {
    const originalExperiment = await this.byId(experimentResult.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji výsledek experimentu.');
    const result = await this.repository.update(experimentResult);

    const finalExperiment = await this.byId(experimentResult.id);
    this._publishMessage(EXPERIMENT_RESULT_UPDATE, finalExperiment);
    return finalExperiment;
  }

  async delete(id: number): Promise<ExperimentResult> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this.repository.delete(id);

    this._publishMessage(EXPERIMENT_RESULT_DELETE, experiment);
    return experiment;
  }

  async experimentData(id: number): Promise<any> {
    const experimentResult: ExperimentResult = await this.byId(id);
    if (experimentResult === undefined) {
      return undefined;
    }

    const buffer = await fs.promises.readFile(path.join(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY, experimentResult.filename),
      { encoding: 'utf-8'});
    return JSON.parse(buffer);
  }

  async validateExperimentResult(experimentResult: ExperimentResult): Promise<boolean> {
    this.logger.log('Validuji výsledek experimentu.');
    const result: ValidatorResult = this.validator.validate(experimentResult, ExperimentResultsService.JSON_SCHEMA);
    this.logger.log(`Je výsledek experimentu validní: ${result.valid}.`);
    if (!result.valid) {
      this.logger.debug(result.errors);
    }
    return result.valid;
  }

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

}
