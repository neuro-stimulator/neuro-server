import {
  CommandBus,
  EventsHandler,
  IEventHandler,
  QueryBus,
} from '@nestjs/cqrs';

import {
  ClientConnectedEvent,
  SendCommand,
} from '@diplomka-backend/stim-lib-socket';

import { GetStimulatorConnectionStatusQuery } from '../../queries/impl/get-stimulator-connection-status.query';

@EventsHandler(ClientConnectedEvent)
export class ClientConnectedHandler
  implements IEventHandler<ClientConnectedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    const connected = await this.queryBus.execute<
      GetStimulatorConnectionStatusQuery,
      boolean
    >(new GetStimulatorConnectionStatusQuery());

    await this.commandBus.execute(
      new SendCommand(event.clientID, { connected })
    );
  }
}
