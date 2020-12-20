import { Inject, Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SettingsWasLoadedEvent } from '@diplomka-backend/stim-feature-settings';
import { TOKEN_OPEN_PORT_AUTOMATICALLY } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcOpenCommand } from '../../commands/impl/ipc-open.command';

@EventsHandler(SettingsWasLoadedEvent)
export class IpcSettingsLoadedHandler implements IEventHandler<SettingsWasLoadedEvent> {
  private readonly logger: Logger = new Logger(IpcSettingsLoadedHandler.name);

  constructor(@Inject(TOKEN_OPEN_PORT_AUTOMATICALLY) private readonly openPortAutomatically: boolean, private readonly commmandBus: CommandBus) {}

  async handle(event: SettingsWasLoadedEvent): Promise<void> {
    if (this.openPortAutomatically) {
      this.logger.debug('Inicializace IPC');
      try {
        await this.commmandBus.execute(new IpcOpenCommand());
      } catch (e) {
        this.logger.error(e.message);
      }
    }
  }
}
