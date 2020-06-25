import { Injectable, Logger } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import {
  createEmptyExperimentResult,
  Experiment,
  ExperimentResult,
} from '@stechy1/diplomka-share';

import { StimulatorIoChangeData } from '@diplomka-backend/stim-feature-stimulator';

import { ExperimentResultsRepository } from '../repository/experiment-results.repository';

@Injectable()
export class ExperimentResultsService {
  public static readonly EXPERIMENT_RESULTS_DIRECTORY_NAME =
    'experiment-results';

  private readonly logger = new Logger(ExperimentResultsService.name);
  private readonly _repository: ExperimentResultsRepository;
  private readonly _experimentResultWrapper: {
    experimentResult: ExperimentResult;
    experimentData: StimulatorIoChangeData[];
  } = {
    experimentResult: null,
    experimentData: [],
  };

  constructor(_manager: EntityManager) {
    this._repository = _manager.getCustomRepository(
      ExperimentResultsRepository
    );
    // this._initSerialListeners();
    // this._initExperimentResultsDirectory().finally();
  }

  // private _initSerialListeners() {
  //   this._serial.bindEvent(EventStimulatorState.name, (event) =>
  //     this._stimulatorStateListener(event)
  //   );
  //   this._serial.bindEvent(EventIOChange.name, (event) =>
  //     this._ioChangeListener(event)
  //   );
  // }

  // private async _initExperimentResultsDirectory() {
  //   if (!this._fileBrowser.existsFile(this.getExperimentResultsDirectory())) {
  //     this.logger.verbose(
  //       `Inicializuji složku s výsledky experimentů: ${this.getExperimentResultsDirectory()}`
  //     );
  //     await this._fileBrowser.createDirectory(
  //       this.getExperimentResultsDirectory()
  //     );
  //   }
  // }

  // private _stimulatorStateListener(event: EventStimulatorState) {
  //   if (event.noUpdate) {
  //     return;
  //   }
  //
  //   switch (event.state) {
  //     case CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED:
  //       this._experimentResultWrapper.experimentData = [];
  //       for (
  //         let i = 0;
  //         i < this._experimentResultWrapper.experimentResult.outputCount;
  //         i++
  //       ) {
  //         const e = {
  //           name: 'EventIOChange',
  //           ioType: 'output',
  //           state: 'off',
  //           index: i,
  //           timestamp: event.timestamp,
  //         };
  //         this._ioChangeListener(e as EventIOChange);
  //         this._serial.publishMessage(EXPERIMENT_RESULT_DATA, e);
  //       }
  //       break;
  //     case CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED:
  //       this.logger.verbose(
  //         `Experient byl úspěšně ukončen s délkou dat: ${this._experimentResultWrapper.experimentData.length}`
  //       );
  //       this.insert().finally();
  //       break;
  //   }
  // }

  // private _ioChangeListener(event: EventIOChange) {
  //   this._experimentResultWrapper.experimentData.push(event);
  // }

  // private getExperimentResultsDirectory(resultName?: string): string {
  //   return this._fileBrowser.mergePrivatePath(
  //     ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME,
  //     resultName
  //   );
  // }

  public async findAll(): Promise<ExperimentResult[]> {
    this.logger.verbose('Hledám všechny výsledky experimentů...');
    const experimentResults: ExperimentResult[] = await this._repository.all();
    this.logger.verbose(`Bylo nalezeno: ${experimentResults.length} záznamů.`);
    return experimentResults;
  }

  public async byId(id: number): Promise<ExperimentResult> {
    this.logger.verbose(`Hledám výsledek experimentu s id: ${id}`);
    const experimentResult = await this._repository.one(id);
    if (experimentResult === undefined) {
      return undefined;
    }
    return experimentResult;
  }

  public async insert(): Promise<number> {
    if (this._experimentResultWrapper.experimentResult === null) {
      throw new Error('Experiment result not initialized!');
    }
    this.logger.verbose('Vkládám nový výsledek experimentu do databáze.');
    const result = await this._repository.insert(
      this._experimentResultWrapper.experimentResult
    );
    // if (
    //   !this._fileBrowser.writeFileContent(
    //     this.getExperimentResultsDirectory(
    //       this._experimentResultWrapper.experimentResult.filename
    //     ),
    //     JSON.stringify(this._experimentResultWrapper.experimentData)
    //   )
    // ) {
    //   // TODO vymyslet, jak ošetřít případ, kdy se nazapíšou data na disk
    //   this.logger.error('Data experimentu se nepodařilo zapsat do souboru!');
    // }
    // this.clearRunningExperimentResult();

    // const finalExperimentResult = await this.byId(result.raw);
    // this._publishMessage(EXPERIMENT_RESULT_INSERT, finalExperimentResult);
    return result.raw;
  }

  public async update(experimentResult: ExperimentResult): Promise<void> {
    const originalExperiment = await this.byId(experimentResult.id);
    if (originalExperiment === undefined) {
      return undefined;
    }

    this.logger.verbose('Aktualizuji výsledek experimentu.');
    const result = await this._repository.update(experimentResult);

    // const finalExperiment = await this.byId(experimentResult.id);
    // this._publishMessage(EXPERIMENT_RESULT_UPDATE, finalExperiment);
    // return finalExperiment;
  }

  public async delete(id: number): Promise<void> {
    const experiment = await this.byId(id);
    if (experiment === undefined) {
      return undefined;
    }

    this.logger.verbose(`Mažu výsledek experimentu s id: ${id}`);
    const result = await this._repository.delete(id);

    // this._publishMessage(EXPERIMENT_RESULT_DELETE, experiment);
    // return experiment;
  }

  // public async experimentData(id: number): Promise<any> {
  //   const experimentResult: ExperimentResult = await this.byId(id);
  //   if (experimentResult === undefined) {
  //     return undefined;
  //   }
  //
  //   // const buffer: string = this._fileBrowser.readFileBuffer(
  //   //   this.getExperimentResultsDirectory(experimentResult.filename),
  //   //   { encoding: 'utf-8' }
  //   // ) as string;
  //   // return JSON.parse(buffer);
  // }

  // public async validateExperimentResult(
  //   experimentResult: ExperimentResult
  // ): Promise<boolean> {
  //   this.logger.verbose('Validuji výsledek experimentu.');
  //   const result: ValidatorResult = this._validator.validate(
  //     experimentResult,
  //     ExperimentResultsService.JSON_SCHEMA
  //   );
  //   this.logger.verbose(`Je výsledek experimentu validní: ${result.valid}.`);
  //   if (!result.valid) {
  //     this.logger.debug(result.errors);
  //   }
  //   return result.valid;
  // }

  public async nameExists(name: string, id: number): Promise<boolean> {
    this.logger.verbose(
      `Testuji, zda-li zadaný název pro existující výsledek experimentu již existuje: ${name}.`
    );
    const exists = await this._repository.nameExists(name, id);
    this.logger.verbose(`Výsledek existence názvu: ${exists}.`);
    return exists;
  }

  // public registerMessagePublisher(
  //   messagePublisher: (topic: string, data: any) => void
  // ) {
  //   this._publishMessage = messagePublisher;
  // }

  // public publishMessage(topic: string, data: any): void {
  //   this._publishMessage(topic, data);
  // }

  public clearRunningExperimentResult() {
    this._experimentResultWrapper.experimentResult = null;
    this._experimentResultWrapper.experimentData = [];
  }

  public createEmptyExperimentResult(experiment: Experiment): ExperimentResult {
    this._experimentResultWrapper.experimentResult = createEmptyExperimentResult(
      experiment
    );

    this._experimentResultWrapper.experimentData = [];
    return this.activeExperimentResult;
  }

  public get activeExperimentResult(): ExperimentResult {
    return this._experimentResultWrapper.experimentResult
      ? { ...this._experimentResultWrapper.experimentResult }
      : null;
  }

  public get activeExperimentResultData(): StimulatorIoChangeData[] {
    return this._experimentResultWrapper.experimentData
      ? [...this._experimentResultWrapper.experimentData]
      : null;
  }

  pushResultData(data: StimulatorIoChangeData) {
    this.logger.verbose('Připojuji další data do výsledku experimentu.');
    this.logger.verbose(data);
    this._experimentResultWrapper.experimentData?.push(data);
  }
}
