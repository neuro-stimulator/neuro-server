import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundException } from '@diplomka-backend/stim-feature-sequences/domain';

import { SequencesService } from '../../services/sequences.service';
import { SequenceByIdQuery } from '../impl/sequence-by-id.query';

@QueryHandler(SequenceByIdQuery)
export class SequenceByIdHandler implements IQueryHandler<SequenceByIdQuery, Sequence> {
  constructor(private readonly service: SequencesService) {}

  async execute(query: SequenceByIdQuery): Promise<Sequence> {
    const sequence = await this.service.byId(query.sequenceID);
    if (!sequence) {
      throw new SequenceIdNotFoundException(query.sequenceID);
    }

    return sequence;
  }
}
