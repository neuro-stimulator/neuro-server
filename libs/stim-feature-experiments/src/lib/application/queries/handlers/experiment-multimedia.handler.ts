import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { ExperimentIdNotFoundError } from '../../../domain/exception';
import { ExperimentMultimediaQuery } from '../impl/experiment-multimedia.query';

@QueryHandler(ExperimentMultimediaQuery)
export class ExperimentMultimediaHandler
  implements
    IQueryHandler<ExperimentMultimediaQuery, { audio: {}; image: {} }> {
  constructor(private readonly service: ExperimentsService) {}

  execute(query: ExperimentMultimediaQuery): Promise<{ audio: {}; image: {} }> {
    const multimedia = this.service.usedOutputMultimedia(query.experimentID);
    if (multimedia) {
      throw new ExperimentIdNotFoundError();
    }

    return multimedia;
  }
}
