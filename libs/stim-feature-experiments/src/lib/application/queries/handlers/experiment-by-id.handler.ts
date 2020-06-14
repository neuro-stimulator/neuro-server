import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Experiment } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentIdNotFoundError } from '../../../domain/exception';
import { ExperimentByIdQuery } from '../impl/experiment-by-id.query';

@QueryHandler(ExperimentByIdQuery)
export class ExperimentByIdHandler
  implements IQueryHandler<ExperimentByIdQuery, Experiment> {
  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentByIdQuery): Promise<Experiment> {
    const experiment = await this.service.byId(query.experimentID);
    if (!experiment) {
      throw ExperimentIdNotFoundError.withString(query.experimentID);
    }

    return experiment;
  }
}
