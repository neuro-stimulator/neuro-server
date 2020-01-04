import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { Repository } from 'typeorm';

import { ExperimentResult, CommandFromStimulator } from '@stechy1/diplomka-share';

import { ExperimentResultEntity } from './experiment-result.entity';
import { SerialService } from '../low-level/serial.service';
import { EventStimulatorState } from '../low-level/protocol/hw-events';
import { IoEventInmemoryEntity } from '../experiments/cache/io-event.inmemory.entity';
import { ExperimentsService } from '../experiments/experiments.service';
import { entityToExperimentResult, experimentResultToEntity } from './experiment-results.mapping';
import { FileBrowserService } from '../file-browser/file-browser.service';
import { MessagePublisher } from '../share/utils';
import { EXPERIMENT_RESULT_DELETE, EXPERIMENT_RESULT_INSERT, EXPERIMENT_RESULT_UPDATE } from './experiment-results.gateway.protocol';

@Injectable()
export class ExperimentResultsService implements MessagePublisher {

  private static readonly EXPERIMENT_RESULTS_DIRECTORY = `${FileBrowserService.mergePrivatePath('experiment-results')}`;

  private readonly logger = new Logger(ExperimentResultsService.name);

  private _publishMessage: (topic: string, data: any) => void;

  constructor(@InjectRepository(ExperimentResultEntity)
              private readonly repository: Repository<ExperimentResultEntity>,
              private readonly inmemoryDB: InMemoryDBService<IoEventInmemoryEntity>,
              private readonly serial: SerialService,
              private readonly experiments: ExperimentsService) {
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
      case CommandFromStimulator.COMMAND_STIMULATOR_STATE_STOP:
        this.logger.log(`Experient byl úspěšně ukončen s delkou dat: ${this.inmemoryDB.records.length}`);
        const experimentResult = this.experiments.experimentResult;
        const experimentData = this.inmemoryDB.records;
        const stream = fs.createWriteStream(path.join(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY, experimentResult.filename));
        const success = stream.write(JSON.stringify(experimentData));
        stream.close();
        if (!success) {
          this.logger.error('Data experimentu se nepodařilo zapsat do souboru!');
        }
        this.repository.insert(experimentResultToEntity(experimentResult)).then(result => {
          experimentResult.id = result.raw;
          this._publishMessage(EXPERIMENT_RESULT_INSERT, experimentResult);
        });
        this.experiments.clearRunningExperimentResult();
        break;
    }
  }

  async findAll(): Promise<ExperimentResult[]> {
    this.logger.log('Hledám všechny výsledky experimentů...');
    const experimentResultEntities: ExperimentResultEntity[] = await this.repository.createQueryBuilder('result').orderBy('result.date', 'DESC').getMany();
    this.logger.log(`Bylo nalezeno: ${experimentResultEntities.length} záznamů.`);
    return experimentResultEntities.map(value => entityToExperimentResult(value));
  }

  async byId(id: number): Promise<ExperimentResult> {
    this.logger.log(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResultEntity: ExperimentResultEntity = await this.repository.findOne(id);
    if (experimentResultEntity === undefined) {
      return undefined;
    }

    return entityToExperimentResult(experimentResultEntity);
  }

  async insert(experimentResult: ExperimentResult): Promise<ExperimentResult> {
    this.logger.log('Vkládám nový výsledek experimentu do databáze.');
    const entity: ExperimentResultEntity = this.repository.create();
    const result = await this.repository.insert(experimentResultToEntity(experimentResult));
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
    const result = await this.repository.update({ id: experimentResult.id }, experimentResultToEntity(experimentResult));

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
    const result = await this.repository.delete({ id });

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

  registerMessagePublisher(messagePublisher: (topic: string, data: any) => void) {
    this._publishMessage = messagePublisher;
  }

  publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

}
