import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../service/stimulator.service';
import { LastKnowStimulatorStateQuery } from '../impl/last-know-stimulator-state.query';

@QueryHandler(LastKnowStimulatorStateQuery)
export class LastKnowStimulatorStateHandler implements IQueryHandler<LastKnowStimulatorStateQuery, number> {
  private readonly logger: Logger = new Logger(LastKnowStimulatorStateHandler.name);

  constructor(private readonly service: StimulatorService) {}

  async execute(query: LastKnowStimulatorStateQuery): Promise<number> {
    this.logger.debug('Zjišťuji poslední známý stav stimulátoru.');
    return this.service.lastKnownStimulatorState;
  }
}
