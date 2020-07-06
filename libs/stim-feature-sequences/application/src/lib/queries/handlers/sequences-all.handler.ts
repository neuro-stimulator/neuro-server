import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesService } from '../../services/sequences.service';
import { SequencesAllQuery } from '../impl/sequences-all.query';

@QueryHandler(SequencesAllQuery)
export class SequencesAllHandler implements IQueryHandler<SequencesAllQuery, Sequence[]> {
  constructor(private readonly service: SequencesService) {}

  execute(query: SequencesAllQuery): Promise<Sequence[]> {
    return this.service.findAll();
  }
}
