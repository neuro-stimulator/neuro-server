import { Injectable, Logger } from '@nestjs/common';

import { Settings } from '../model/settings';

@Injectable()
export class SettingsService {
  // private static readonly SETTINGS_FILE_NAME = 'settings.json';
  // Výchozí nastavení aplikace
  private static readonly DEFAULT_SETTINGS: Settings = {
    autoconnectToStimulator: false,
    serial: {
      baudRate: 9600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
    },
    stimulatorResponseTimeout: 4000,
  };

  private readonly logger: Logger = new Logger(SettingsService.name);

  private _settings: Settings = SettingsService.DEFAULT_SETTINGS;

  constructor() {
    // // Pokud existuje soubor s nastavením serveru
    // if (this._fileBrowser.existsFile(this.userSettingsFile)) {
    //   this.logger.log(
    //     `Načítám nastavení ze souboru: '${this.userSettingsFile}'.`
    //   );
    //   // Načtu jeho obsah
    //   const settings: string = this._fileBrowser.readFileBuffer(
    //     this.userSettingsFile,
    //     { encoding: 'utf-8' }
    //   ) as string;
    //   // Vypíšu do konzole
    //   this.logger.debug(settings);
    //   // Vezmu výchozí nastavení a změním všekeré upravené hodnoty
    //   this._settings = Object.assign(
    //     SettingsService.DEFAULT_SETTINGS,
    //     (settings && JSON.parse(settings)) || {}
    //   );
    // } else {
    //   // Soubor neexistuje, proto si uložím výchozí nastavení
    //   this._settings = SettingsService.DEFAULT_SETTINGS;
    //   // Uložím do souboru výchozí nastavení
    //   this._fileBrowser.writeFileContent(
    //     this.userSettingsFile,
    //     JSON.stringify(this._settings)
    //   );
    // }
  }

  // private get userSettingsFile(): string {
  //   return this._fileBrowser.mergePrivatePath(
  //     SettingsService.SETTINGS_FILE_NAME
  //   );
  // }

  /**
   * Aktualizuje klientské nastavení serveru
   *
   * @param settings Struktura s nastavením
   */
  public async updateSettings(settings: Settings) {
    this._settings = Object.assign(this._settings, settings);
    // this.logger.log('Aktualizuji uživatelské nastaveni serveru.');
    // return new Promise((resolve, reject) => {
    //   const data = JSON.stringify(settings);
    //   this.logger.debug(data);
    //   this.logger.log(`Používám soubor: '${this.userSettingsFile}'.`);
    //   const options = { encoding: 'utf-8' };
    //   if (process.platform !== 'win32') {
    //     options['flags'] = 'rw';
    //   }
    //   const success = this._fileBrowser.writeFileContent(
    //     this.userSettingsFile,
    //     data
    //   );
    //   if (!success) {
    //     this.logger.error('Nastala chyba při aktualizaci nastavení!');
    //     reject();
    //   } else {
    //     this.logger.log('Nastavení se podařilo aktualizovat.');
    //     resolve();
    //   }
    // });
  }

  /**
   * Vrátí klientské nastavení serveru
   */
  get settings(): Settings {
    return this._settings;
  }
}
