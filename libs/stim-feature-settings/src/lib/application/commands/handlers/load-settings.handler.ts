import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { FileBrowserFacade, FileNotFoundException } from '@neuro-server/stim-feature-file-browser';

import { SETTINGS_MODULE_CONFIG_CONSTANT, SettingsModuleConfig } from '../../../domain/config';
import { SettingsService } from '../../../domain/services/settings.service';
import { SettingsWasLoadedEvent } from '../../event/impl/settings-was-loaded.event';
import { LoadSettingsCommand } from '../impl/load-settings.command';

@CommandHandler(LoadSettingsCommand)
export class LoadSettingsHandler implements ICommandHandler<LoadSettingsCommand, void> {
  private readonly logger: Logger = new Logger(LoadSettingsHandler.name);
  constructor(
    @Inject(SETTINGS_MODULE_CONFIG_CONSTANT) private readonly config: SettingsModuleConfig,
    private readonly service: SettingsService,
    private readonly facade: FileBrowserFacade,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: LoadSettingsCommand): Promise<void> {
    this.logger.debug('Budu načítat nastavení serveru.');
    try {
      // Přečtu nastavení ze souboru
      const settings: Settings = await this.facade.readPrivateJSONFile<Settings>(this.config.fileName);
      // Aktualizuji nastavení ve službě
      await this.service.updateSettings(settings);
      // Publikuji událost, že bylo nastavení úspěšně načteno
      this.eventBus.publish(new SettingsWasLoadedEvent(this.service.settings));
    } catch (e) {
      this.logger.error(e);
      // Nastavení se nepodařilo načíst (třeba soubor vůbec neexistuje
      if (e instanceof FileNotFoundException) {
        this.logger.error(`Soubor s nastavením: ${e.path} nebyl nalezen! Používám výchozí nastavení...`);
      }
    }
  }
}
