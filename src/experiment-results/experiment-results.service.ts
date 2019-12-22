import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

import { Repository } from 'typeorm';

import { ExperimentResult } from 'diplomka-share';

import { ExperimentResultEntity } from './experiment-result.entity';
import { entityToExperimentResult, experimentResultToEntity } from './experiment-results.mapping';
import { SerialService } from '../low-level/serial.service';
import { EventStimulatorState } from '../low-level/protocol/hw-events';
import { COMMAND_MANAGE_EXPERIMENT_STOP } from '../commands/protocol/commands.protocol';
import { IoEventInmemoryEntity } from '../experiments/cache/io-event.inmemory.entity';
import { ExperimentsService } from '../experiments/experiments.service';

@Injectable()
export class ExperimentResultsService {

  private static readonly EXPERIMENT_RESULTS_DIRECTORY = '/tmp/experiment-results';

  private readonly logger = new Logger(ExperimentResultsService.name);

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
      case COMMAND_MANAGE_EXPERIMENT_STOP:
        this.logger.log(`Experient byl úspěšně ukončen s delkou dat: ${this.inmemoryDB.records.length}`);
        const experimentResult = this.experiments.experimentResult;
        const experimentData = this.inmemoryDB.records;
        const stream = fs.createWriteStream(path.join(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY, experimentResult.filename));
        const success = stream.write(JSON.stringify(experimentData));
        stream.close();
        if (!success) {
          this.logger.error('Data experimentu se nepodařilo zapsat do souboru!');
        }
        this.repository.insert(experimentResultToEntity(experimentResult)).finally();
        this.experiments.clearRunningExperimentResult();
        break;
    }
  }

  async findAll(): Promise<ExperimentResult[]> {
    this.logger.log('Hledám všechny výsledky experimentů...');
    // const experimentResultEntities: ExperimentResultEntity[] = await this.repository.find();
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

  async insert(experiment: ExperimentResult): Promise<ExperimentResult> {
    this.logger.log('Vkládám nový výsledek experimentu do databáze.');
    const entity: ExperimentResultEntity = this.repository.create();
    const result = await this.repository.insert(experimentResultToEntity(experiment));
    experiment.id = result.raw;

    return this.byId(experiment.id);
  }

  async update(experiment: ExperimentResult): Promise<ExperimentResult> {
    const originalExperiment = await this.byId(experiment.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.log('Aktualizuji výsledek experiment.');
    const result = await this.repository.update({ id: experiment.id }, experimentResultToEntity(experiment));

    return this.byId(experiment.id);
  }

  async delete(id: number): Promise<ExperimentResult> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.log(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this.repository.delete({ id });

    return experiment;
  }

  async experimentData(id: number): Promise<any> {
    const experimentResult: ExperimentResult = await this.byId(id);
    if (experimentResult === undefined) {
      return undefined;
    }

    const buffer = await fs.promises.readFile(path.join(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY, experimentResult.filename), { encoding: 'utf-8'});
    return JSON.parse(buffer);
  }

}
