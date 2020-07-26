import { Injectable, Logger } from '@nestjs/common';

import { Experiment, ExperimentResult, IOEvent, createEmptyExperimentResult } from '@stechy1/diplomka-share';

import {
  AnotherExperimentResultIsInitializedException,
  ExperimentAlreadyInitializedException,
  ExperimentResultIsNotInitializedException,
} from '@diplomka-backend/stim-feature-player/domain';

@Injectable()
export class PlayerService {
  private readonly logger: Logger = new Logger(PlayerService.name);

  private _experimentResult: ExperimentResult;
  private _experimentData: IOEvent[][];
  private _experimentRound: number;
  private _experimentRepeat: number;

  /**
   * Vymaže aktuální výsledek experiment i jeho data z paměti
   */
  public clearRunningExperimentResult() {
    this.logger.verbose('Mažu aktuální výsledek experimentu a jeho data.');
    this._experimentResult = null;
    this._experimentData = [];
    this._experimentRound = 0;
  }

  /**
   * Založí nový výsledek experimentu
   *
   * @param experiment Experiment, který se bude spouštět
   */
  public createEmptyExperimentResult(experiment: Experiment): ExperimentResult {
    if (this._experimentResult) {
      throw new AnotherExperimentResultIsInitializedException(this._experimentResult, experiment);
    }

    this._experimentResult = createEmptyExperimentResult(experiment);
    this._experimentRound = 0;

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
   * Nastaví počet opakování pro budoucí experiment
   * Počet opakování lze nastavit pouze před začátkem experimentu
   *
   * @param experimentRepeat Počet opakování experimentu
   * @throws ExperimentAlreadyInitializedException
   */
  public set experimentRepeat(experimentRepeat: number) {
    if (this._experimentResult) {
      throw new ExperimentAlreadyInitializedException();
    }

    this._experimentRepeat = experimentRepeat;
  }
}
