import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentResult, IOEvent, createEmptyExperimentResult } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentAlreadyInitializedException,
  ExperimentEndCondition,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class PlayerService {
  private readonly logger: Logger = new Logger(PlayerService.name);

  private _experimentResult: ExperimentResult;
  private _experimentData: IOEvent[][];
  private _experimentRound: number;
  private _experimentRepeat: number;
  private _betweenExperimentInterval: number;
  private _experimentEndCondition: ExperimentEndCondition;

  /**
   * Vymaže aktuální výsledek experiment i jeho data z paměti
   */
  public clearRunningExperimentResult() {
    this.logger.verbose('Mažu aktuální výsledek experimentu a jeho data.');
    this._experimentResult = null;
    this._experimentData = [];
    this._experimentRound = 0;
    this._experimentRepeat = 0;
    this._betweenExperimentInterval = 0;
    this._experimentEndCondition = null;
  }

  /**
   * Založí nový výsledek experimentu
   *
   * @param experiment Experiment, který se bude spouštět
   * @param experimentEndCondition ExperimentEndCondition Ukončovací podmínka experimentu
   * @param experimentRepeat number Počet opakování experimentu
   * @param betweenExperimentInterval Časový interval mezi dvěma experimenty
   */
  public createEmptyExperimentResult(
    experiment: Experiment,
    experimentEndCondition: ExperimentEndCondition,
    experimentRepeat: number,
    betweenExperimentInterval?: number
  ): ExperimentResult {
    if (this._experimentResult) {
      throw new AnotherExperimentResultIsInitializedException(this._experimentResult, experiment);
    }

    this._experimentResult = createEmptyExperimentResult(experiment);
    this._experimentRound = 0;
    this._experimentEndCondition = experimentEndCondition;
    this._experimentRepeat = experimentRepeat;
    this._betweenExperimentInterval = betweenExperimentInterval;

    this._experimentData = [];
    this._experimentData.push([]);
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
    this._experimentData[this._experimentRound].push(data);
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
    this._experimentRound++;
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

    return [...this._experimentData[this._experimentRound]];
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
    return this._experimentRound;
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
    return this._experimentEndCondition.canContinue(this.activeExperimentResultData);
  }

  /**
   * Getter pro zjištění, zdali je možné připravit další kolo experimentu
   */
  public get nextRoundAvailable(): boolean {
    return this.experimentRound <= this.experimentRepeat;
  }
}
