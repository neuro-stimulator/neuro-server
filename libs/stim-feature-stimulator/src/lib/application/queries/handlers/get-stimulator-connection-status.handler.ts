import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SerialService } from '../../../domain/service/serial.service';
import { GetStimulatorConnectionStatusQuery } from '../impl/get-stimulator-connection-status.query';

@QueryHandler(GetStimulatorConnectionStatusQuery)
export class GetStimulatorConnectionStatusHandler
  implements IQueryHandler<GetStimulatorConnectionStatusQuery, boolean> {
  constructor(private readonly serial: SerialService) {}

  async execute(query: GetStimulatorConnectionStatusQuery): Promise<boolean> {
    return this.serial.isConnected;
  }
}
