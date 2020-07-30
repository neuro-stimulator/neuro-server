import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentResult, IOEvent, createEmptyExperimentResult } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentAlreadyInitializedException,
  ExperimentStopCondition,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class PlayerService {
  private readonly logger: Logger = new Logger(PlayerService.name);

  private _experimentResult: ExperimentResult;
  private _experimentData: IOEvent[][];
  private _experimentRepeat: number;
  private _betweenExperimentInterval: number;
  private _experimentStopCondition: ExperimentStopCondition;
  private _autoplay = false;
  private _isBreakTime = false;

  /**
   * Vymaže aktuální výsledek experiment i jeho data z paměti
   */
  public clearRunningExperimentResult() {
    this.logger.verbose('Mažu aktuální výsledek experimentu a jeho data.');
    this._experimentResult = null;
    this._experimentData = [];
    this._experimentRepeat = 0;
    this._betweenExperimentInterval = 0;
    this._experimentStopCondition = null;
    this._autoplay = false;
  }

  /**
   * Založí nový výsledek experimentu
   *
   * @param experiment Experiment, který se bude spouštět
   * @param experimentStopCondition ExperimentStopCondition Ukončovací podmínka experimentu
   * @param experimentRepeat number Počet opakování experimentu
   * @param betweenExperimentInterval Časový interval mezi dvěma experimenty
   * @param autoplay True, pokud se mají všechna kola experimentu přehrávat automaticky
   */
  public createEmptyExperimentResult(
    experiment: Experiment,
    experimentStopCondition: ExperimentStopCondition,
    experimentRepeat: number,
    betweenExperimentInterval?: number,
    autoplay: boolean = false
  ): ExperimentResult {
    if (this._experimentResult) {
      throw new AnotherExperimentResultIsInitializedException(this._experimentResult, experiment);
    }

    this._experimentResult = createEmptyExperimentResult(experiment);
    this._experimentStopCondition = experimentStopCondition;
    this._experimentRepeat = experimentRepeat;
    this._betweenExperimentInterval = betweenExperimentInterval;

    this._experimentData = [];
    this._experimentData.push([]);
    this._autoplay = autoplay;
    this._isBreakTime = false;
    return this.activeExperimentResult;
  }

  /**
   * Připojí data výsledku experimentu do aktuálního kola
   *
   * @param data IOEvent
   * @throws ExperimentResultIsNotInitializedException
   */
  public pushResultData(data: IOEvent) {
    this.logger.verbose('Připojuji další data do výsledku experimentu.');
    this.logger.verbose(data);
    if (!this._experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }
    this._experimentData[this.experimentRound].push(data);
  }

  /**
   * Inkrementuje index kola experimentu
   *
   * @throws ExperimentResultIsNotInitializedException
   */
  public nextExperimentRound(): void {
    if (!this._experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    this.logger.verbose('Inkrementuji kolo experimentu.');
    this._experimentData.push([]);
  }

  /**
   * Vrátí instanci výsledeku experimentu
   *
   * @return ExperimentResult
   * @throws ExperimentResultIsNotInitializedException Pokud není výsledek experimentu inicializovaný
   */
  public get activeExperimentResult(): ExperimentResult {
    if (!this._experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._experimentResult;
  }

  /**
   * Getter pro data výsledku experimentu
   *
   * @return IOEvent[]
   * @throws ExperimentResultIsNotInitializedException
   */
  public get activeExperimentResultData(): IOEvent[] {
    if (!this._experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return [...this._experimentData[this.experimentRound]];
  }

  /**
   * Getter data výsledků všech kol experimentu
   *
   * @return IOEvent[][]
   * @throws ExperimentResultIsNotInitializedException
   */
  public get experimentResultData(): IOEvent[][] {
    if (!this._experimentResult) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return [...this._experimentData];
  }

  /**
   * Getter pro index kola experimentu
   *
   * @return number
   */
  public get experimentRound(): number {
    return this._experimentData ? this._experimentData.length - 1 : 0;
  }

  /**
   * Getter pro počet opakování experimentu
   */
  public get experimentRepeat(): number {
    return this._experimentRepeat;
  }

  /**
   * Getter pro ukončovací podmínku experimentu
   *
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get canExperimentContinue(): boolean {
    this.logger.verbose('Ověřuji ukončovací podmínku experimentu.');
    return this._experimentStopCondition.canContinue(this.activeExperimentResultData);
  }

  /**
   * Getter pro zjištění, zdali je možné připravit další kolo experimentu
   */
  public get nextRoundAvailable(): boolean {
    // experimentRound == index do pole
    // experimentRepeat == počet opakování
    return this.experimentRound < this.experimentRepeat;
  }

  /**
   * Getter pro zjištění, zdali se budou kola experimentů přehrávat automaticky
   */
  public get autoplay(): boolean {
    return this._autoplay;
  }

  /**
   * Nastavi, zdali se mají kola experimentů přehrávat automaticky
   *
   * @param autoplay True pro automatické přehrávání kol expeirimentů
   */
  public set autoplay(autoplay: boolean) {
    this._autoplay = autoplay;
  }

  /**
   * Spustí časovač s hodnotou čekání mezi experimenty
   */
  public scheduleNextRound(): Promise<void> {
    this.logger.verbose(`Plánuji automatické spuštění dalšího kola experimentu za: ${this._betweenExperimentInterval}ms.`);
    this._isBreakTime = true;
    return new Promise((resolve) => {
      setTimeout(() => {
        this.logger.verbose('Uplynul čas čekání mezi experimenty.');
        this._isBreakTime = false;
        resolve();
      }, this._betweenExperimentInterval);
    });
  }

  /**
   * Getter pro hodnotu s intervalem čekání [ms] mezi jednotlivými experimenty
   */
  public get betweenExperimentInterval(): number {
    return this._betweenExperimentInterval;
  }

  public get isBreakTime(): boolean {
    return this._isBreakTime;
  }
}
