import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { GetCurrentExperimentIdQuery } from '../impl/get-current-experiment-id.query';

@QueryHandler(GetCurrentExperimentIdQuery)
export class GetCurrentExperimentIdHandler
  implements IQueryHandler<GetCurrentExperimentIdQuery, number> {
  constructor(private readonly service: StimulatorService) {}

  async execute(query: GetCurrentExperimentIdQuery): Promise<number> {
    return this.service.currentExperimentID;
  }
}
