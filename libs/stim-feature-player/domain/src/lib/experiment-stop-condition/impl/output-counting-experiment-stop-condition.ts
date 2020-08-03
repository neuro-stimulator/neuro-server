import { ExperimentStopConditionType, IOEvent } from '@stechy1/diplomka-share';

import { Logger } from '@nestjs/common';

import { ExperimentStopCondition } from '../experiment-stop-condition';

/**
 * Základní implementace ukončovací podmínky experimentu založená na
 * celkovém počtu uběhlých výstupů
 */
export class OutputCountingExperimentStopCondition implements ExperimentStopCondition {
  private readonly logger: Logger = new Logger(OutputCountingExperimentStopCondition.name);

  public readonly stopConditionType: ExperimentStopConditionType = ExperimentStopConditionType.COUNTING_EXPERIMENT_STOP_CONDITION;

  constructor(private readonly maxCount: number) {
    this.logger.verbose(`Byla vytvořena ukončovací podmínka na základě celkového počtu zobrazených stimulů. Počet stimulů: ${maxCount}.`);
  }

  canContinue(ioData: IOEvent[]): boolean {
    return ioData.length < this.maxCount - 1;
  }
}
