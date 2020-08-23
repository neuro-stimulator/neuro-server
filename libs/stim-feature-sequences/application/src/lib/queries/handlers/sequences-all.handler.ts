import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesService } from '../../services/sequences.service';
import { SequencesAllQuery } from '../impl/sequences-all.query';

@QueryHandler(SequencesAllQuery)
export class SequencesAllHandler implements IQueryHandler<SequencesAllQuery, Sequence[]> {
  private readonly logger: Logger = new Logger(SequencesAllHandler.name);

  constructor(private readonly service: SequencesService) {}

  execute(query: SequencesAllQuery): Promise<Sequence[]> {
    this.logger.debug('Budu vyhledávat všechny sekvence.');
    return this.service.findAll({ where: { userId: query.userID } });
  }
}
