import { IOEvent } from '@stechy1/diplomka-share';

export interface ExperimentStopCondition {
  /**
   * Zjistí, zdali je možné pokračovat v experimentu, nebo se má ukončit
   *
   * @param ioData IOEvent[] Data výsledku experimentu pro aktivní měření
   * @return boolean True, pokud experiment může pokračovat, jinak False
   */
  canContinue(ioData: IOEvent[]): boolean;
}
