import { Injectable, Logger } from '@nestjs/common';

import { UnsupportedExperimentEndConditionException } from '../exception/unsupported-experiment-end-condition.exception';
import { ExperimentEndCondition } from './experiment-end-condition';
import { ExperimentEndConditionType } from './experiment-end-condition.type';
import { OutputCountingExperimentEndCondition } from './impl/output-counting-experiment-end-condition';
import { ExperimentEndConditionParams, OutputCountingExperimentEndConditionParams } from './experiment-end-condition-params';

@Injectable()
export class ExperimentEndConditionFactory {
  private readonly logger: Logger = new Logger(ExperimentEndConditionFactory.name);

  /**
   * Vytvoří instanci ukončovací podmínky experimentu na základě parametrů
   *
   * @param conditionType ExperimentEndConditionType Typ podmínky
   * @param params ExperimentEndConditionParams Parametry ukončovací podmínky
   * @throws UnsupportedExperimentEndConditionException Pokud nebude ukončovací podmínka rozeznána
   */
  public createCondition(conditionType: ExperimentEndConditionType, params: ExperimentEndConditionParams): ExperimentEndCondition {
    this.logger.verbose(`Vytvářím novou instanci ukončovací podmínky experimentu pro typ: ${ExperimentEndConditionType[conditionType]}`);
    this.logger.verbose(params);
    switch (conditionType) {
      case ExperimentEndConditionType.COUNTING_EXPERIMENT_END_CONDITION:
        return new OutputCountingExperimentEndCondition((params as OutputCountingExperimentEndConditionParams).maxOutput);
      default:
        throw new UnsupportedExperimentEndConditionException(conditionType);
    }
  }
}
