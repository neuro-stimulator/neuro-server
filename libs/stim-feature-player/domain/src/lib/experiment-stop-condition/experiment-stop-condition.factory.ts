import { Injectable, Logger } from '@nestjs/common';

import {
  CycleCountingExperimentStopConditionParams,
  ExperimentStopConditionParams,
  ExperimentStopConditionType,
  OutputCountingExperimentStopConditionParams,
} from '@stechy1/diplomka-share';

import { UnsupportedExperimentStopConditionException } from '../exception/unsupported-experiment-stop-condition.exception';

import { ExperimentStopCondition } from './experiment-stop-condition';
import { CycleCountingExperimentStopCondition } from './impl/cycle-counting-experiment-stop-condition';
import { NoStopCondition } from './impl/no-stop-condition';
import { OutputCountingExperimentStopCondition } from './impl/output-counting-experiment-stop-condition';

@Injectable()
export class ExperimentStopConditionFactory {
  private readonly logger: Logger = new Logger(ExperimentStopConditionFactory.name);

  /**
   * Vytvoří instanci ukončovací podmínky experimentu na základě parametrů
   *
   * @param conditionType ExperimentStopConditionType Typ podmínky
   * @param params ExperimentStopConditionParams Parametry ukončovací podmínky
   * @throws UnsupportedExperimentStopConditionException Pokud nebude ukončovací podmínka rozeznána
   */
  public createCondition(conditionType: ExperimentStopConditionType, params: ExperimentStopConditionParams): ExperimentStopCondition {
    this.logger.verbose(`Vytvářím novou instanci ukončovací podmínky experimentu pro typ: ${ExperimentStopConditionType[conditionType]}`);
    this.logger.verbose(params);
    switch (conditionType) {
      case ExperimentStopConditionType.NO_STOP_CONDITION:
        return new NoStopCondition();
      case ExperimentStopConditionType.COUNTING_EXPERIMENT_STOP_CONDITION:
        return new OutputCountingExperimentStopCondition(params as OutputCountingExperimentStopConditionParams);
      case ExperimentStopConditionType.COUNTING_CYCLE_STOP_CONDITION:
        return new CycleCountingExperimentStopCondition(params as CycleCountingExperimentStopConditionParams);
      default:
        throw new UnsupportedExperimentStopConditionException(conditionType);
    }
  }
}
