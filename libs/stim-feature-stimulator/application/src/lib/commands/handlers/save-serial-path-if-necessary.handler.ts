import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { GetSettingsQuery, UpdateSettingsCommand } from '@neuro-server/stim-feature-settings';

import { SaveSerialPathIfNecessaryCommand } from '../impl/save-serial-path-if-necessary.command';

@CommandHandler(SaveSerialPathIfNecessaryCommand)
export class SaveSerialPathIfNecessaryHandler implements ICommandHandler<SaveSerialPathIfNecessaryCommand, void> {
  private readonly logger: Logger = new Logger(SaveSerialPathIfNecessaryHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async execute(command: SaveSerialPathIfNecessaryCommand): Promise<void> {
    this.logger.debug('Možná aktualizovat cestu k sériové lince.');
    this.logger.debug('1. Získám aktuální nastavení.');
    // Odešlu požadavek na získání nastavení
    const originalSettings: Settings = await this.queryBus.execute(new GetSettingsQuery());
    this.logger.debug('Nastavení bylo úspěšně získáno');
    this.logger.debug('2. Z nastavení si přečtu pořebnou proměnnou.');
    const saveSerialPath = originalSettings.autoconnectToStimulator;
    this.logger.debug(`{autoconnectToStimulator=${saveSerialPath}}.`);
    this.logger.debug('3. Na základě proměnné se rozhodnu, zda-li aktualizuji nastavení, či nikoliv.');
    if (saveSerialPath) {
      this.logger.debug('Budu aktualizovat cestu k sériové lince.');
      const settings = { ...originalSettings };
      settings.comPortName = command.path;
      this.logger.debug('Odesílám požadavek na aktualizaci nastavení.');
      await this.commandBus.execute(new UpdateSettingsCommand(settings));
    } else {
      this.logger.debug('Nic aktualizovat nebudu.');
    }
  }
}
