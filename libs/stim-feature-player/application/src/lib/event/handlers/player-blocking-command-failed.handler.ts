import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { StimulatorBlockingCommandFailedEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';

@EventsHandler(StimulatorBlockingCommandFailedEvent)
export class PlayerBlockingCommandFailedHandler implements IEventHandler<StimulatorBlockingCommandFailedEvent> {
  private readonly logger: Logger = new Logger(PlayerBlockingCommandFailedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: StimulatorBlockingCommandFailedEvent): Promise<void> {
    switch (event.command) {
      case 'upload':
      case 'setup':
        this.logger.debug('Budu mazat konfiguraci přehrávače experimentů.');
        await this.commandBus.execute(new ExperimentResultClearCommand());
        break;
    }
  }
}
