import { Injectable, Logger } from '@nestjs/common';

import { Settings } from '../model/settings';

@Injectable()
export class SettingsService {
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
    assetPlayer: {
      width: 640,
      height: 480,
      fullScreen: false,
    },
    assetPlayerResponseTimeout: 4000,
  };

  private readonly logger: Logger = new Logger(SettingsService.name);

  private _settings: Settings = SettingsService.DEFAULT_SETTINGS;

  /**
   * Aktualizuje klientské nastavení serveru
   *
   * @param settings Struktura s nastavením
   */
  public async updateSettings(settings: Settings) {
    this.logger.verbose('Aktualizuji nastavení.');
    this._settings = Object.assign(this._settings, settings);
  }

  /**
   * Vrátí klientské nastavení serveru
   */
  get settings(): Settings {
    return this._settings;
  }
}
