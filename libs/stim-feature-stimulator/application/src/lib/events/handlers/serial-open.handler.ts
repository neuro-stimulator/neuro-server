import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { StimulatorStateCommand } from '../../commands/impl/stimulator-state.command';
import { SendStimulatorStateChangeToClientCommand } from '../../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { SerialOpenEvent } from '../impl/serial-open.event';

@EventsHandler(SerialOpenEvent)
export class SerialOpenHandler implements IEventHandler<SerialOpenEvent> {
  private readonly logger: Logger = new Logger(SerialOpenHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SerialOpenEvent): Promise<void> {
    this.logger.debug('Budu odesílat synchronní požadavek na získání stavu stimulátoru.');
    try {
      const stimulatorStateData: StimulatorStateData = await this.commandBus.execute(new StimulatorStateCommand(true));
      this.logger.debug('Stav stimulátoru po otevření sériového portu byl úspěšně získán.');
      await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(stimulatorStateData.state));
    } catch (e) {
      this.logger.error('Nastala chyba při čtení stavu stimulátoru po otevření sériového portu!', e);
    }
  }
}
