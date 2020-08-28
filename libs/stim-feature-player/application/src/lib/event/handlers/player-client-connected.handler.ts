import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentStopConditionType, IOEvent } from '@stechy1/diplomka-share';

import { ClientConnectedEvent } from '@diplomka-backend/stim-lib-socket';

import { PlayerService } from '../../service/player.service';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';

@EventsHandler(ClientConnectedEvent)
export class PlayerClientConnectedHandler implements IEventHandler<ClientConnectedEvent> {
  private readonly logger: Logger = new Logger(PlayerClientConnectedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    this.logger.debug('Budu připojenému klitovi odesílat informaci o stavu přehrávače experimentu.');
    const initialized = this.service.isExperimentResultInitialized;
    const data: IOEvent[][] = initialized ? this.service.experimentResultData : [];
    const repeat: number = initialized ? this.service.experimentRepeat : 0;
    const betweenExperimentInterval: number = initialized ? this.service.betweenExperimentInterval : 0;
    const autoplay: boolean = initialized ? this.service.autoplay : false;
    const isBreakTime: boolean = initialized ? this.service.isBreakTime : false;
    const stopConditionType: ExperimentStopConditionType = initialized ? this.service.stopConditionType : 0;

    await this.commandBus.execute(
      new SendPlayerStateToClientCommand(initialized, data, repeat, betweenExperimentInterval, autoplay, isBreakTime, stopConditionType, event.clientID)
    );
  }
}
