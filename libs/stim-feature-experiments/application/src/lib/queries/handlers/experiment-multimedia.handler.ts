import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentAssets } from '@stechy1/diplomka-share';

import { ExperimentsService } from '../../services/experiments.service';
import { ExperimentMultimediaQuery } from '../impl/experiment-multimedia.query';

@QueryHandler(ExperimentMultimediaQuery)
export class ExperimentMultimediaHandler implements IQueryHandler<ExperimentMultimediaQuery, ExperimentAssets> {
  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentMultimediaQuery): Promise<ExperimentAssets> {
    return this.service.usedOutputMultimedia(query.userGroups, query.experimentID);
  }
}
