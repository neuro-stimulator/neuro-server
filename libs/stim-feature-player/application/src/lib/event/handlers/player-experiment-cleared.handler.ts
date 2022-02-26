import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentClearedEvent } from '@neuro-server/stim-feature-stimulator/application';

import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';
import { PlayerService } from '../../service/player.service';

@EventsHandler(ExperimentClearedEvent)
export class PlayerExperimentClearedHandler implements IEventHandler<ExperimentClearedEvent> {
  private readonly logger: Logger = new Logger(PlayerExperimentClearedHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentClearedEvent): Promise<void> {
    this.logger.debug('Experiment byl vymazán z paměti stimulátoru.');

    if (!this.service.isExperimentResultInitialized) {
      this.logger.debug('Výsledek experimentu nebyl inicializovaný, nemám co mazat.');
      return;
    }
    const outputCount = this.service.activeExperimentResult.outputCount;
    if (!this.service.nextRoundAvailable) {
      this.logger.debug('Protože už není dostupné žádné kolo experimentu, budu mazat výsledek expeirmentu.');
      await this.commandBus.execute(new ExperimentResultClearCommand());
      return;
    }

    if (this.service.experimentResultData[0].length <= outputCount) {
      this.logger.debug('Experiment byl pouze nahraný nanejvýš inicializovaný, budu mazat výsledek experimentu.');
      await this.commandBus.execute(new ExperimentResultClearCommand());
      return;
    }

    if (event.force) {
      this.logger.debug('Vymazání experimentu bylo ručně vynuceno, budu mazat výsledek experimentu.');
      await this.commandBus.execute(new ExperimentResultClearCommand());
      return;
    }

    this.logger.debug('Výsledek experimentu je stále inicializovaný v přehrávači.');
  }
}
