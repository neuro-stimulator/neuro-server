import { ExperimentStopConditionParams, ExperimentStopConditionType, IOEvent } from '@stechy1/diplomka-share';

export interface ExperimentStopCondition {
  readonly stopConditionType: ExperimentStopConditionType;
  readonly stopConditionParams: ExperimentStopConditionParams;

  /**
   * Zjistí, zdali je možné pokračovat v experimentu, nebo se má ukončit
   *
   * @param ioData IOEvent[] Data výsledku experimentu pro aktivní měření
   * @param experimentIoData Kolekce všech dat pro všechna měření
   * @return boolean True, pokud experiment může pokračovat, jinak False
   */
  canContinue(ioData: IOEvent[], experimentIoData: IOEvent[][]): boolean;
}
