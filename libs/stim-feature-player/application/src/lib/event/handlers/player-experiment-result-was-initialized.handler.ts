import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';
import { PlayerService } from '../../service/player.service';
import { ExperimentResultWasInitializedEvent } from '../impl/experiment-result-was-initialized.event';

@EventsHandler(ExperimentResultWasInitializedEvent)
export class PlayerExperimentResultWasInitializedHandler implements IEventHandler<ExperimentResultWasInitializedEvent> {
  private readonly logger: Logger = new Logger(PlayerExperimentResultWasInitializedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentResultWasInitializedEvent): Promise<void> {
    this.logger.debug('Výsledek experimentu byl úspěšně inicializován.');

    await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration));
  }
}
