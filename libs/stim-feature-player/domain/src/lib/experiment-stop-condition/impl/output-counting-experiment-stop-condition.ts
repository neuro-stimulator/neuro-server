import { Logger } from '@nestjs/common';

import { ExperimentStopConditionType, IOEvent, OutputCountingExperimentStopConditionParams } from '@stechy1/diplomka-share';

import { ExperimentStopCondition } from '../experiment-stop-condition';

/**
 * Základní implementace ukončovací podmínky experimentu založená na
 * celkovém počtu uběhlých výstupů
 */
export class OutputCountingExperimentStopCondition implements ExperimentStopCondition {
  private readonly logger: Logger = new Logger(OutputCountingExperimentStopCondition.name);

  public readonly stopConditionType: ExperimentStopConditionType = ExperimentStopConditionType.COUNTING_EXPERIMENT_STOP_CONDITION;

  constructor(public readonly stopConditionParams: OutputCountingExperimentStopConditionParams) {
    this.logger.verbose(`Byla vytvořena ukončovací podmínka na základě celkového počtu zobrazených stimulů. Počet stimulů: ${stopConditionParams.maxOutput}.`);
  }

  canContinue(ioData: IOEvent[]): boolean {
    return ioData.length < this.stopConditionParams.maxOutput - 1;
  }
}
