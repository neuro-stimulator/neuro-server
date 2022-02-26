import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentClearCommand } from '../../commands/impl/experiment-clear.command';
import { SendStimulatorStateChangeToClientCommand } from '../../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorBlockingCommandFailedEvent } from '../impl/stimulator-blocking-command-failed.event';

@EventsHandler(StimulatorBlockingCommandFailedEvent)
export class StimulatorBlockingCommandFailedHandler implements IEventHandler<StimulatorBlockingCommandFailedEvent> {
  private readonly logger: Logger = new Logger(StimulatorBlockingCommandFailedHandler.name);

  constructor(private readonly service: StimulatorService, private readonly commandBus: CommandBus) {}

  async handle(event: StimulatorBlockingCommandFailedEvent): Promise<void> {
    this.logger.debug('Protože selhalo vykonání blokujícího příkazu na stimulátoru, budu aktualizovat stav stimulátoru u klientů.');

    await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(this.service.lastKnownStimulatorState));
    await this.commandBus.execute(new ExperimentClearCommand(false));
  }
}
