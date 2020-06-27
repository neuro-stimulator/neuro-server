import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentMultimediaQuery } from '../impl/experiment-multimedia.query';

@QueryHandler(ExperimentMultimediaQuery)
export class ExperimentMultimediaHandler implements IQueryHandler<ExperimentMultimediaQuery, { audio: {}; image: {} }> {
  constructor(private readonly service: ExperimentsService) {}

  async execute(query: ExperimentMultimediaQuery): Promise<{ audio: {}; image: {} }> {
    return this.service.usedOutputMultimedia(query.experimentID);
  }
}
