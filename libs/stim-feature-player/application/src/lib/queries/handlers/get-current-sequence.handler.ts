import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share/lib';

import { GetCurrentSequenceQuery } from '../impl/get-current-sequence.query';
import { PlayerService } from '../../service/player.service';

@QueryHandler(GetCurrentSequenceQuery)
export class GetCurrentSequenceHandler implements IQueryHandler<GetCurrentSequenceQuery, Sequence> {

  constructor(private readonly service: PlayerService) {}

  async execute(_query: GetCurrentSequenceQuery): Promise<Sequence> {
    return this.service.sequence
  }
}
