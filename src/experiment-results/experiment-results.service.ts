import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';

import { EntityManager} from 'typeorm';
import { Validator, ValidatorResult } from 'jsonschema';

import { CommandFromStimulator, createEmptyExperimentResult, Experiment, ExperimentResult } from '@stechy1/diplomka-share';

import { SerialService } from '../low-level/serial.service';
import { EventIOChange, EventStimulatorState } from '../low-level/protocol/hw-events';
import { ExperimentsService } from '../experiments/experiments.service';
import { FileBrowserService } from '../file-browser/file-browser.service';
import { MessagePublisher } from '../share/utils';
import { EXPERIMENT_RESULT_DATA, EXPERIMENT_RESULT_DELETE, EXPERIMENT_RESULT_INSERT, EXPERIMENT_RESULT_UPDATE } from './experiment-results.gateway.protocol';
import { ExperimentResultsRepository } from './repository/experiment-results.repository';

@Injectable()
export class ExperimentResultsService implements MessagePublisher {

  private static readonly EXPERIMENT_RESULTS_DIRECTORY_NAME = 'experiment-results';
  private static readonly JSON_SCHEMA = JSON.parse(fs.readFileSync('schemas/experiment-result.json', { encoding: 'utf-8' }));

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly _repository: ExperimentResultsRepository;
  private readonly _validator: Validator = new Validator();
  private readonly _experimentResultWrapper: {experimentResult: ExperimentResult, experimentData: EventIOChange[]} = {
    experimentResult: null,
    experimentData: []
  };

  private _publishMessage: (topic: string, data: any) => void;

  constructor(private readonly _serial: SerialService,
              private readonly _experiments: ExperimentsService,
              private readonly _fileBrowser: FileBrowserService,
              _manager: EntityManager) {
    this._repository = _manager.getCustomRepository(ExperimentResultsRepository);
    this._initSerialListeners();
    this._initExperimentResultsDirectory().finally();
  }

  private _initSerialListeners() {
    this._serial.bindEvent(EventStimulatorState.name, (event) => this._stimulatorStateListener(event));
    this._serial.bindEvent(EventIOChange.name, (event) => this._ioChangeListener(event));
  }

  private async _initExperimentResultsDirectory() {
    if (!this._fileBrowser.existsFile(this.getExperimentResultsDirectory())) {
      this.logger.log(`Inicializuji složku s výsledky experimentů: ${this.getExperimentResultsDirectory()}`);
      await this._fileBrowser.createDirectory(this.getExperimentResultsDirectory());
    }
  }

  private _stimulatorStateListener(event: EventStimulatorState) {
    if (event.noUpdate) {
      return;
    }

    switch (event.state) {
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
        this._experimentResultWrapper.experimentData = [];
        for (let i = 0; i < this._experimentResultWrapper.experimentResult.outputCount; i++) {
          const e = {name: 'EventIOChange', ioType: 'output', state: 'off', index: i, timestamp: event.timestamp};
          this._ioChangeListener(e as EventIOChange);
          this._serial.publishMessage(EXPERIMENT_RESULT_DATA, e);
        }
        break;
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
        const experimentResult = this._experimentResultWrapper.experimentResult;
        const experimentData = this._experimentResultWrapper.experimentData;
        this.logger.log(`Experient byl úspěšně ukončen s delkou dat: ${experimentData.length}`);
        if (!this._fileBrowser.writeFileContent(this.getExperimentResultsDirectory(experimentResult.filename), JSON.stringify(experimentData))) {
          this.logger.error('Data experimentu se nepodařilo zapsat do souboru!');
        }
        this.insert(experimentResult).finally();
        this.clearRunningExperimentResult();
        break;
    }
  }

  private _ioChangeListener(event: EventIOChange) {
    this._experimentResultWrapper.experimentData.push(event);
  }

  private getExperimentResultsDirectory(resultName?: string): string {
    return this._fileBrowser.mergePrivatePath(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME, resultName);
  }

  public async findAll(): Promise<ExperimentResult[]> {
    this.logger.log('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this._repository.all();
    this.logger.log(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  public async byId(id: number): Promise<ExperimentResult> {
    this.logger.log(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this._repository.one(id);
    if (experimentResult === undefined) {
      return undefined;
    }
    return experimentResult;
  }

  public async insert(experimentResult: ExperimentResult): Promise<ExperimentResult> {
    this.logger.log('Vkládám nový výsledek experimentu do databáze.');
    const result = await this._repository.insert(experimentResult);
    experimentResult.id = result.raw;

    const finalExperiment = await this.byId(experimentResult.id);
    this._publishMessage(EXPERIMENT_RESULT_INSERT, finalExperiment);
    return finalExperiment;
  }

  public async update(experimentResult: ExperimentResult): Promise<ExperimentResult> {
    const originalExperiment = await this.byId(experimentResult.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji výsledek experimentu.');
    const result = await this._repository.update(experimentResult);

    const finalExperiment = await this.byId(experimentResult.id);
    this._publishMessage(EXPERIMENT_RESULT_UPDATE, finalExperiment);
    return finalExperiment;
  }

  public async delete(id: number): Promise<ExperimentResult> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this._repository.delete(id);

    this._publishMessage(EXPERIMENT_RESULT_DELETE, experiment);
    return experiment;
  }

  public async experimentData(id: number): Promise<any> {
    const experimentResult: ExperimentResult = await this.byId(id);
    if (experimentResult === undefined) {
      return undefined;
    }

    const buffer: string = this._fileBrowser.readFileBuffer(this.getExperimentResultsDirectory(experimentResult.filename), { encoding: 'utf-8' }) as string;
    return JSON.parse(buffer);
  }

  public async validateExperimentResult(experimentResult: ExperimentResult): Promise<boolean> {
    this.logger.log('Validuji výsledek experimentu.');
    const result: ValidatorResult = this._validator.validate(experimentResult, ExperimentResultsService.JSON_SCHEMA);
    this.logger.log(`Je výsledek experimentu validní: ${result.valid}.`);
    if (!result.valid) {
      this.logger.debug(result.errors);
    }
    return result.valid;
  }

  public registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  public publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

  public clearRunningExperimentResult() {
    this._experimentResultWrapper.experimentResult = null;
    this._experimentResultWrapper.experimentData = [];
  }

  public createEmptyExperimentResult(experiment: Experiment) {
    this._experimentResultWrapper.experimentResult = createEmptyExperimentResult(experiment);
  }

  public get activeExperimentResult(): ExperimentResult {
    return (this._experimentResultWrapper.experimentResult)
      ? {...this._experimentResultWrapper.experimentResult}
      : null;
  }

}
