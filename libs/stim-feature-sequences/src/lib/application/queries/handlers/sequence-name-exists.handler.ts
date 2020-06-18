import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SequencesService } from '../../../domain/services/sequences.service';
import { SequenceNameExistsQuery } from '../impl/sequence-name-exists.query';

@QueryHandler(SequenceNameExistsQuery)
export class SequenceNameExistsHandler
  implements IQueryHandler<SequenceNameExistsQuery, boolean> {
  constructor(private readonly service: SequencesService) {}

  async execute(query: SequenceNameExistsQuery): Promise<boolean> {
    return this.service.nameExists(query.name, query.expeirmentID);
  }
}
