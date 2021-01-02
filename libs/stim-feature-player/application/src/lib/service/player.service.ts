import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentResult, IOEvent, createEmptyExperimentResult, ExperimentStopConditionType, PlayerConfiguration, Output } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentStopCondition,
  ExperimentResultIsNotInitializedException,
  PlayerLocalConfiguration,
  NoStopCondition,
} from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class PlayerService {
  private readonly logger: Logger = new Logger(PlayerService.name);

  private _experimentResult?: ExperimentResult;
  private _experimentData: IOEvent[][] = [];
  private _experimentRepeat = 0;
  private _betweenExperimentInterval = 0;
  private _experimentStopCondition: ExperimentStopCondition = new NoStopCondition();
  private _autoplay = false;
  private _isBreakTime = false;
  private _userID?: number;

  public get playerConfiguration(): PlayerConfiguration {
    return {
      initialized: this.isExperimentResultInitialized,
      betweenExperimentInterval: this._betweenExperimentInterval,
      autoplay: this._autoplay,
      ioData: this._experimentData,
      isBreakTime: this._isBreakTime,
      repeat: this._experimentRepeat,
      stopConditionType: this._experimentStopCondition.stopConditionType,
      stopConditions: this._experimentStopCondition.stopConditionParams,
    };
  }

  public get playerLocalConfiguration(): PlayerLocalConfiguration {
    return {
      userID: this._userID || -1,
      ...this.playerConfiguration,
    };
  }

  /**
   * Vymaže aktuální výsledek experiment i jeho data z paměti
   *
   * @throws ExperimentResultIsNotInitializedException Pokud není výsledek experimentu inicializovaný
   */
  public clearRunningExperimentResult(): void {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    this.logger.verbose('Mažu aktuální výsledek experimentu a jeho data.');
    this._experimentResult = undefined;
    this._experimentData = [];
    this._experimentRepeat = 0;
    this._userID = undefined;
    this._betweenExperimentInterval = 0;
    this._experimentStopCondition = new NoStopCondition();
    this._autoplay = false;
  }

  /**
   * Založí nový výsledek experimentu
   *
   * @param userID ID uživatele, který získá výhradní právo na ovládání experimentu
   * @param experiment Experiment, který se bude spouštět
   * @param experimentStopCondition ExperimentStopCondition Ukončovací podmínka experimentu
   * @param experimentRepeat number Počet opakování experimentu
   * @param betweenExperimentInterval Časový interval mezi dvěma experimenty
   * @param autoplay True, pokud se mají všechna kola experimentu přehrávat automaticky
   * @throws AnotherExperimentResultIsInitializedException Pokud je jiný výsledek experimentu již inicializovaný
   */
  public createEmptyExperimentResult(
    userID: number,
    experiment: Experiment<Output>,
    experimentStopCondition: ExperimentStopCondition,
    experimentRepeat: number,
    betweenExperimentInterval?: number,
    autoplay = false
  ): ExperimentResult {
    if (this.isExperimentResultInitialized) {
      throw new AnotherExperimentResultIsInitializedException(<ExperimentResult>this._experimentResult, experiment);
    }

    this._experimentResult = createEmptyExperimentResult(experiment);
    this._experimentStopCondition = experimentStopCondition;
    this._experimentRepeat = experimentRepeat;
    this._userID = userID;
    if (betweenExperimentInterval != null) {
      this._betweenExperimentInterval = betweenExperimentInterval;
    }

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
   * @throws ExperimentResultIsNotInitializedException Pokud není výsledek experimentu inicializovaný
   */
  public pushResultData(data: IOEvent): void {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    this.logger.verbose('Připojuji další data do výsledku experimentu.');
    this.logger.verbose(data);
    this._experimentData[this.experimentRound].push(data);
  }

  /**
   * Inkrementuje index kola experimentu
   *
   * @throws ExperimentResultIsNotInitializedException Pokud není výsledek experimentu inicializovaný
   */
  public nextExperimentRound(): void {
    if (!this.isExperimentResultInitialized) {
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
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return <ExperimentResult>this._experimentResult;
  }

  /**
   * Getter pro data výsledku experimentu
   *
   * @return IOEvent[]
   * @throws ExperimentResultIsNotInitializedException
   */
  public get activeExperimentResultData(): IOEvent[] {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return [...this._experimentData[this.experimentRound]];
  }

  /**
   * Getter data výsledků všech kol experimentu
   *
   * @return IOEvent[][]
   * @throws ExperimentResultIsNotInitializedException Pokud experiment není inicializovaný
   */
  public get experimentResultData(): IOEvent[][] {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return [...this._experimentData];
  }

  /**
   * Getter pro index kola experimentu
   *
   * @return number
   * @throws ExperimentResultIsNotInitializedException Pokud experiment není inicializovaný
   */
  public get experimentRound(): number {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._experimentData ? this._experimentData.length - 1 : 0;
  }

  /**
   * Getter pro počet opakování experimentu
   *
   * @return number
   * @throws ExperimentResultIsNotInitializedException Pokud experiment není inicializovaný
   */
  public get experimentRepeat(): number {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._experimentRepeat;
  }

  /**
   * Getter pro zjištění, zdali experiment může pokračovat, nebo se má zastavit díky ukončovací podmínce
   *
   * @return boolean
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get canExperimentContinue(): boolean {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    this.logger.verbose('Ověřuji ukončovací podmínku experimentu.');
    return this._experimentStopCondition.canContinue(this.activeExperimentResultData, this.experimentResultData);
  }

  /**
   * Getter pro zjištění, zdali je možné připravit další kolo experimentu
   *
   * @return boolean
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get nextRoundAvailable(): boolean {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    // experimentRound == index do pole
    // experimentRepeat == počet opakování
    return this.experimentRound < this.experimentRepeat;
  }

  /**
   * Getter pro zjištění, zdali se budou kola experimentů přehrávat automaticky
   *
   * @return boolean
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get autoplay(): boolean {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._autoplay;
  }

  /**
   * Nastavi, zdali se mají kola experimentů přehrávat automaticky
   *
   * @param autoplay True pro automatické přehrávání kol expeirimentů
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public set autoplay(autoplay: boolean) {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    this._autoplay = autoplay;
  }

  /**
   * Spustí časovač s hodnotou čekání mezi experimenty
   *
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public scheduleNextRound(): Promise<void> {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

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
   *
   * @return number
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get betweenExperimentInterval(): number {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._betweenExperimentInterval;
  }

  /**
   * Getter pro zjištění, jestli se experiment nachází v pauze mezi experimenty či nikoliv
   *
   * @return boolean
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get isBreakTime(): boolean {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._isBreakTime;
  }

  /**
   * Getter pro ověření, že je výsledek experimentu inicializovaný
   *
   * @return boolean
   */
  public get isExperimentResultInitialized(): boolean {
    return this._experimentResult !== undefined;
  }

  /**
   * Getter pro ziskání typu aktuálně používate zastavovací podmínky
   *
   * @return ExperimentStopConditionType
   * @throws ExperimentResultIsNotInitializedException Pokud výsledek experimentu není inicializovaný
   */
  public get stopConditionType(): ExperimentStopConditionType {
    if (!this.isExperimentResultInitialized) {
      throw new ExperimentResultIsNotInitializedException();
    }

    return this._experimentStopCondition.stopConditionType;
  }

  /**
   * Getter pro získání ID uživatele, který právě ovládá experiment
   */
  get userID(): number | undefined {
    return this._userID;
  }
}
