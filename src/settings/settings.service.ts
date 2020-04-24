import { Injectable, Logger } from '@nestjs/common';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { Settings } from './settings';

@Injectable()
export class SettingsService {

  private static readonly SETTINGS_FILE_NAME = 'settings.json';
  private static readonly DEFAULT_SETTINGS: Settings = {
    autoconnectToStimulator: false
  };

  private readonly logger: Logger = new Logger(SettingsService.name);

  private _settings: Settings;

  constructor(private readonly _fileBrowser: FileBrowserService) {
    if (this._fileBrowser.existsFile(this.userSettingsFile)) {
      this.logger.log(`Načítám nastavení ze souboru: '${this.userSettingsFile}'.`);
      const settings: string = this._fileBrowser.readFileBuffer(this.userSettingsFile, { encoding: 'utf-8'}) as string;
      this.logger.debug(settings);
      this._settings = (settings && JSON.parse(settings)) || SettingsService.DEFAULT_SETTINGS;
    } else {
      this._settings = SettingsService.DEFAULT_SETTINGS;
    }
  }

  private get userSettingsFile(): string {
    return this._fileBrowser.mergePrivatePath(SettingsService.SETTINGS_FILE_NAME);
  }

  /**
   * Aktualizuje klientské nastavení serveru
   *
   * @param settings Struktura s nastavením
   */
  public async updateSettings(settings: Settings) {
    this._settings = settings;
    this.logger.log('Aktualizuji uživatelské nastaveni serveru.');
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(settings);
      this.logger.debug(data);
      this.logger.log(`Používám soubor: '${this.userSettingsFile}'.`);
      const options = {encoding: 'utf-8'};
      if (process.platform !== 'win32') {
        options['flags'] = 'rw';
      }
      const success = this._fileBrowser.writeFileContent(this.userSettingsFile, data);
      if (!success) {
        this.logger.error('Nastala chyba při aktualizaci nastavení!');
        reject();
      } else {
        this.logger.log('Nastavení se podařilo aktualizovat.');
        resolve();
      }
    });
  }

  /**
   * Vrátí klientské nastavení serveru
   */
  get settings(): Settings {
    return this._settings;
  }

}
