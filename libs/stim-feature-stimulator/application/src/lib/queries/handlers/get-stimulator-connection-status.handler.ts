import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { SerialService } from '../../service/serial.service';
import { GetStimulatorConnectionStatusQuery } from '../impl/get-stimulator-connection-status.query';

@QueryHandler(GetStimulatorConnectionStatusQuery)
export class GetStimulatorConnectionStatusHandler implements IQueryHandler<GetStimulatorConnectionStatusQuery, ConnectionStatus> {
  constructor(private readonly serial: SerialService) {}

  async execute(query: GetStimulatorConnectionStatusQuery): Promise<ConnectionStatus> {
    return this.serial.isConnected ? ConnectionStatus.CONNECTED : ConnectionStatus.DISCONNECTED;
  }
}
