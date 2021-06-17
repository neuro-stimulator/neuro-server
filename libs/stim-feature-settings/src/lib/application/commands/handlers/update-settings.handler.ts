import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ContentWasNotWrittenException, FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { SETTINGS_MODULE_CONFIG_CONSTANT, SettingsModuleConfig } from '../../../domain/config';
import { SettingsService } from '../../../domain/services/settings.service';
import { UpdateSettingsFailedException } from '../../../domain/exception/update-settings-failed.exception';
import { UpdateSettingsCommand } from '../impl/update-settings.command';

@CommandHandler(UpdateSettingsCommand)
export class UpdateSettingsHandler implements ICommandHandler<UpdateSettingsCommand, void> {
  private readonly logger: Logger = new Logger(UpdateSettingsHandler.name);

  constructor(@Inject(SETTINGS_MODULE_CONFIG_CONSTANT) private readonly config: SettingsModuleConfig,
              private readonly service: SettingsService, private readonly facade: FileBrowserFacade) {}

  async execute(command: UpdateSettingsCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat nastavení serveru.');
    try {
      // Získám cestu k souboru s nastavením
      const settingsPath = await this.facade.mergePrivatePath(this.config.fileName);
      this.logger.debug(`Cesta k souboru s nastavením: ${settingsPath}.`);
      // Zapíšu nové nastavení
      await this.facade.writePrivateJSONFile(settingsPath, command.settings);
      await this.service.updateSettings(command.settings);
      this.logger.debug('Nastavení bylo aktualizováno.');
    } catch (e) {
      this.logger.error(e);
      if (e instanceof ContentWasNotWrittenException) {
        this.logger.error('Nastavení se nepodařilo zapsat do souboru!');
      }
      throw new UpdateSettingsFailedException();
    }
  }
}
