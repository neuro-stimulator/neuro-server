import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IOEvent } from '@stechy1/diplomka-share';

import { ClientConnectedEvent } from '@diplomka-backend/stim-lib-socket';

import { PlayerService } from '../../service/player.service';
import { SendExperimentStateToClientCommand } from '../../commands/impl/to-client/send-experiment-state-to-client.command';

@EventsHandler(ClientConnectedEvent)
export class PlayerClientConnectedHandler implements IEventHandler<ClientConnectedEvent> {
  private readonly logger: Logger = new Logger(PlayerClientConnectedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    this.logger.debug('Budu připojenému klitovi odesílat informaci o stavu přehrávače experimentu.');
    let initialized;
    let data: IOEvent[][] = [];
    try {
      const active = this.service.activeExperimentResult;
      data = this.service.experimentResultData;
      initialized = true;
    } catch (e) {
      initialized = false;
    }

    await this.commandBus.execute(
      new SendExperimentStateToClientCommand(
        initialized,
        data,
        this.service.experimentRepeat || 0,
        this.service.betweenExperimentInterval || 0,
        this.service.autoplay || false,
        this.service.isBreakTime || false,
        event.clientID
      )
    );
  }
}
