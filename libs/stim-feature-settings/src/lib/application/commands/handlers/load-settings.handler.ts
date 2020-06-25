import { Inject, Logger } from '@nestjs/common';
import { EventBus, ICommandHandler } from '@nestjs/cqrs';

import {
  FileBrowserFacade,
  FileNotFoundException,
} from '@diplomka-backend/stim-feature-file-browser';

import { TOKEN_SETTINGS_FILE_NAME } from '../../../domain/tokens/token';
import { SettingsService } from '../../../domain/services/settings.service';
import { Settings } from '../../../domain/model/settings';
import { SettingsWasLoadedEvent } from '../../event/impl/settings-was-loaded.event';
import { LoadSettingsCommand } from '../impl/load-settings.command';

export class LoadSettingsHandler
  implements ICommandHandler<LoadSettingsCommand, void> {
  private readonly logger: Logger = new Logger(LoadSettingsHandler.name);
  constructor(
    @Inject(TOKEN_SETTINGS_FILE_NAME) private readonly fileName: string,
    private readonly service: SettingsService,
    private readonly facade: FileBrowserFacade,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: LoadSettingsCommand): Promise<void> {
    // Získám cestu k souboru s nastavením
    const settingsPath = await this.facade.mergePrivatePath(this.fileName);
    try {
      // Přečtu nastavení ze souboru
      const settings: Settings = await this.facade.readPrivateJSONFile<
        Settings
      >(settingsPath);
      // Aktualizuji nastavení ve službě
      await this.service.updateSettings(settings);
    } catch (e) {
      this.logger.error(e);
      // Nastavení se nepodařilo načíst (třeba soubor vůbec neexistuje
      if (e instanceof FileNotFoundException) {
        const error = e as FileNotFoundException;
        this.logger.error(
          `Soubor s nastavením: ${error.path} nebyl nalezen! Používám výchozí nastavení...`
        );
      }
    }

    this.eventBus.publish(new SettingsWasLoadedEvent(this.service.settings));
  }
}
