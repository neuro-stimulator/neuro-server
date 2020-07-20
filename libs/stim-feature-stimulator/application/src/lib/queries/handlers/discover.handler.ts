import * as SerialPort from 'serialport';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SerialService } from '../../service/serial.service';
import { DiscoverQuery } from '../impl/discover.query';

@QueryHandler(DiscoverQuery)
export class DiscoverHandler implements IQueryHandler<DiscoverQuery, SerialPort.PortInfo[]> {
  constructor(private readonly serial: SerialService) {}

  execute(query: DiscoverQuery): Promise<SerialPort.PortInfo[]> {
    return this.serial.discover();
  }
}
