import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SerialService } from '../../service/serial.service';
import { DiscoverQuery } from '../impl/discover.query';

@QueryHandler(DiscoverQuery)
export class DiscoverHandler implements IQueryHandler<DiscoverQuery, Record<string, unknown>[]> {
  constructor(private readonly serial: SerialService) {}

  execute(query: DiscoverQuery): Promise<Record<string, unknown>[]> {
    return this.serial.discover();
  }
}
