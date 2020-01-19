import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { Settings } from './settings';
import { WriteStream } from 'fs';

@Injectable()
export class SettingsService {

  private static readonly SETTINGS_FILE_NAME = 'settings.json';
  private static readonly DEFAULT_SETTINGS: Settings = {
    autoconnectToStimulator: false
  };

  private static readonly USER_SETTINGS_FILE = FileBrowserService.mergePrivatePath(SettingsService.SETTINGS_FILE_NAME);

  private readonly logger: Logger = new Logger(SettingsService.name);

  private _settings: Settings;

  constructor() {
    if (fs.existsSync(SettingsService.USER_SETTINGS_FILE)) {
      const settings = fs.readFileSync(SettingsService.USER_SETTINGS_FILE, { encoding: 'utf-8' });
      this._settings = (settings && JSON.parse(settings)) || SettingsService.DEFAULT_SETTINGS;
    } else {
      this._settings = SettingsService.DEFAULT_SETTINGS;
    }
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
      this.logger.log(`Používám soubor: '${SettingsService.USER_SETTINGS_FILE}'.`);
      const options = {encoding: 'utf-8'};
      if (process.platform !== 'win32') {
        options['flag'] = 'rw';
      }
      fs.writeFile(SettingsService.USER_SETTINGS_FILE, data, options, err => {
        if (err) {
          this.logger.error('Nastala chyba při aktualizaci nastavení!');
          this.logger.error(err);
          reject(err);
        } else {
          this.logger.log('Nastavení se podařilo aktualizovat.');
          resolve();
        }
      });
    });
  }

  /**
   * Vrátí klientské nastavení serveru
   */
  get settings(): Settings {
    return this._settings;
  }

}
