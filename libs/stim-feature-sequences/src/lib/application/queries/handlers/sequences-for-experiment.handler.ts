import { IQueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesService } from '../../../domain/services/sequences.service';
import { SequencesForExperimentQuery } from '../impl/sequences-for-experiment.query';

export class SequencesForExperimentHandler
  implements IQueryHandler<SequencesForExperimentQuery, Sequence[]> {
  constructor(private readonly service: SequencesService) {}

  async execute(query: SequencesForExperimentQuery): Promise<Sequence[]> {
    return this.service.findAll({
      where: { experimentID: query.experimentID },
    });
  }
}
