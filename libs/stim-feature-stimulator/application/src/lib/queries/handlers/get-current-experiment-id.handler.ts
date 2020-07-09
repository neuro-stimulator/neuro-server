import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NoUploadedExperimentException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { GetCurrentExperimentIdQuery } from '../impl/get-current-experiment-id.query';

@QueryHandler(GetCurrentExperimentIdQuery)
export class GetCurrentExperimentIdHandler implements IQueryHandler<GetCurrentExperimentIdQuery, number> {
  constructor(private readonly service: StimulatorService) {}

  async execute(query: GetCurrentExperimentIdQuery): Promise<number> {
    const experimentID = this.service.currentExperimentID;

    if (experimentID === -1) {
      throw new NoUploadedExperimentException();
    }

    return experimentID;
  }
}
