import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NoUploadedExperimentException } from '@neuro-server/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { GetCurrentExperimentIdQuery } from '../impl/get-current-experiment-id.query';

@QueryHandler(GetCurrentExperimentIdQuery)
export class GetCurrentExperimentIdHandler implements IQueryHandler<GetCurrentExperimentIdQuery, number> {
  constructor(private readonly service: StimulatorService) {}

  async execute(query: GetCurrentExperimentIdQuery): Promise<number> {
    const experimentID = this.service.currentExperimentID;

    if (experimentID === StimulatorService.NO_EXPERIMENT_ID) {
      throw new NoUploadedExperimentException();
    }

    return experimentID;
  }
}
