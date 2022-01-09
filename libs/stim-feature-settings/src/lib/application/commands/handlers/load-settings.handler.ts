import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { ReadPrivateJSONFileQuery } from '@neuro-server/stim-feature-file-browser/application';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

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
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus
  ) {}

  async execute(_command: LoadSettingsCommand): Promise<void> {
    this.logger.debug('Budu načítat nastavení serveru.');
    try {
      // Přečtu nastavení ze souboru
      const settings: Settings = await this.queryBus.execute(new ReadPrivateJSONFileQuery(this.config.fileName));
      // Aktualizuji nastavení ve službě
      await this.service.updateSettings(settings);
      // Publikuji událost, že bylo nastavení úspěšně načteno
      this.eventBus.publish(new SettingsWasLoadedEvent(this.service.settings));
    } catch (e) {
      this.logger.error('Nepodařilo se načíst soubor s nastavením!');
      // Nastavení se nepodařilo načíst (třeba soubor vůbec neexistuje
      if (e instanceof FileNotFoundException) {
        this.logger.error(`Cesta k souboru s nastavením: '${e.path}'.`);
      }
    }
  }
}
