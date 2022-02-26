import { Sequence } from '@stechy1/diplomka-share/lib';

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PlayerService } from '../../service/player.service';
import { GetCurrentSequenceQuery } from '../impl/get-current-sequence.query';

@QueryHandler(GetCurrentSequenceQuery)
export class GetCurrentSequenceHandler implements IQueryHandler<GetCurrentSequenceQuery, Sequence> {

  constructor(private readonly service: PlayerService) {}

  async execute(_query: GetCurrentSequenceQuery): Promise<Sequence> {
    return this.service.sequence
  }
}
