import { Injectable, Logger } from '@nestjs/common';

import { Settings } from '@stechy1/diplomka-share';

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

  private static mergeSettings(lhs: Settings, rhs: Settings): void {
    Object.keys(lhs).forEach((key) => {
      if (!rhs[key]) {
        rhs[key] = lhs[key];
      } else if (typeof lhs[key] === 'object' && lhs[key] !== null && typeof rhs[key] === 'object' && rhs[key] !== null) {
        SettingsService.mergeSettings(rhs[key], lhs[key]);
      }
    });
  }

  /**
   * Aktualizuje klientské nastavení serveru
   *
   * @param settings Struktura s nastavením
   */
  public async updateSettings(settings: Settings): Promise<void> {
    this.logger.verbose('Aktualizuji nastavení.');
    SettingsService.mergeSettings(this._settings, settings);
  }

  /**
   * Vrátí klientské nastavení serveru
   */
  get settings(): Settings {
    return this._settings;
  }
}
