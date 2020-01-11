import * as fs from 'fs';

import { Injectable, Logger } from '@nestjs/common';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { Settings } from './settings';

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

  public async updateSettings(settings: Settings) {
    this._settings = settings;
    this.logger.log('Aktualizuji uživatelské nastaveni serveru.');
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(settings);
      this.logger.log(`Používám soubor: '${SettingsService.USER_SETTINGS_FILE}'.`);
      fs.writeFile(SettingsService.USER_SETTINGS_FILE, data, {encoding: 'utf-8', flag: 'rw'}, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get settings(): Settings {
    return this._settings;
  }

}
