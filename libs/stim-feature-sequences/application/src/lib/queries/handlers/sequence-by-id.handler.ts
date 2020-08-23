import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesService } from '../../services/sequences.service';
import { SequenceByIdQuery } from '../impl/sequence-by-id.query';

@QueryHandler(SequenceByIdQuery)
export class SequenceByIdHandler implements IQueryHandler<SequenceByIdQuery, Sequence> {
  private readonly logger: Logger = new Logger(SequenceByIdHandler.name);

  constructor(private readonly service: SequencesService) {}

  async execute(query: SequenceByIdQuery): Promise<Sequence> {
    this.logger.debug('Budu vyhledávat sekvenci podle ID.');
    return await this.service.byId(query.sequenceID, query.userID);
  }
}
