import { Inject, Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SettingsWasLoadedEvent } from '@diplomka-backend/stim-feature-settings';

import { IpcOpenCommand } from '../../commands/impl/ipc-open.command';
import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';

@EventsHandler(SettingsWasLoadedEvent)
export class IpcSettingsLoadedHandler implements IEventHandler<SettingsWasLoadedEvent> {
  private readonly logger: Logger = new Logger(IpcSettingsLoadedHandler.name);

  constructor(@Inject(ASSET_PLAYER_MODULE_CONFIG_CONSTANT) private readonly config: AssetPlayerModuleConfig, private readonly commmandBus: CommandBus) {}

  async handle(event: SettingsWasLoadedEvent): Promise<void> {
    if (this.config.openPortAutomatically) {
      this.logger.debug('Inicializace IPC');
      try {
        await this.commmandBus.execute(new IpcOpenCommand());
      } catch (e) {
        this.logger.error(e.message);
      }
    }
  }
}
