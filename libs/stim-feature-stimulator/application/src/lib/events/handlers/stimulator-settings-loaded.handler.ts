import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SettingsWasLoadedEvent, UpdateSettingsCommand } from '@neuro-server/stim-feature-settings';

import { OpenCommand } from '../../commands/impl/open.command';

@EventsHandler(SettingsWasLoadedEvent)
export class StimulatorSettingsLoadedHandler implements IEventHandler<SettingsWasLoadedEvent> {
  private readonly logger: Logger = new Logger(StimulatorSettingsLoadedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SettingsWasLoadedEvent): Promise<void> {
    if (!event.settings.autoconnectToStimulator) {
      this.logger.debug('Nebudu automaticky otevírat sériový port.');
      return;
    }

    if (event.settings.comPortName === undefined) {
      this.logger.debug('Cesta k sériovému portu není definována. Ruším automatické připojení ke stimulátoru.');
      const settings = { ...event.settings };
      settings.autoconnectToStimulator = false;
      await this.commandBus.execute(new UpdateSettingsCommand(settings));
    } else {
      this.logger.debug('Budu automaticky otevírat sériový port.');
      await this.commandBus.execute(new OpenCommand(event.settings.comPortName));
    }
  }
}
