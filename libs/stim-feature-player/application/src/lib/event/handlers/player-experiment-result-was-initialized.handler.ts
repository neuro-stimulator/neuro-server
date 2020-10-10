import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PlayerService } from '../../service/player.service';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';
import { ExperimentResultWasInitializedEvent } from '../impl/experiment-result-was-initialized.event';

@EventsHandler(ExperimentResultWasInitializedEvent)
export class PlayerExperimentResultWasInitializedHandler implements IEventHandler<ExperimentResultWasInitializedEvent> {
  private readonly logger: Logger = new Logger(PlayerExperimentResultWasInitializedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentResultWasInitializedEvent): Promise<any> {
    this.logger.debug('Výsledek experimentu byl úspěšně inicializován.');

    await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration));
  }
}
