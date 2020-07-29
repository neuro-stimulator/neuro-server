import { IOEvent } from '@stechy1/diplomka-share';

import { ExperimentEndCondition } from '../experiment-end-condition';
import { Logger } from '@nestjs/common';

/**
 * Základní implementace ukončovací podmínky experimentu založená na
 * celkovém počtu uběhlých výstupů
 */
export class OutputCountingExperimentEndCondition implements ExperimentEndCondition {
  private readonly logger: Logger = new Logger(OutputCountingExperimentEndCondition.name);

  constructor(private readonly maxCount: number) {
    this.logger.verbose(`Byla vytvořena ukončovací podmínka na základě celkového počtu zobrazených stimulů. Počet stimulů: ${maxCount}.`);
  }

  canContinue(ioData: IOEvent[]): boolean {
    return ioData.length <= this.maxCount;
  }
}
