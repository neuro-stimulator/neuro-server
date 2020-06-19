import * as SerialPort from 'serialport';
import { Logger } from '@nestjs/common';

import { EventBus } from '@nestjs/cqrs';
import {
  SerialClosedEvent,
  StimulatorDataEvent,
  SerialOpenEvent,
} from '../../application/events';

/**
 * Abstraktní třída poskytující služby kolem sériové linky
 */
export abstract class SerialService {
  protected readonly logger: Logger = new Logger(SerialService.name);

  protected constructor(private readonly eventBus: EventBus) {}

  /**
   * Uloží cestu k COM portu.
   *
   * @param path Cesta k COM portu.
   */
  protected _saveComPort(path: string) {
    // // Vytvořím si hlubokou kopii nastavení
    // const settings = {...this._settings.settings};
    // // Pokud je poslední uložená cesta ke COM portu stejná, nebudu nic ukládat.
    // if (settings.comPortName === path) {
    //   return;
    // }
    //
    // // COM port je jiný, než ten, co byl posledně použitý
    // settings.comPortName = path;
    // this._settings.updateSettings(settings).finally();
  }

  /**
   * Handler na přijatá data ze seriové linky
   *
   * @param data Přijatá data v binární podobě
   */
  protected _handleIncommingData(data: Buffer) {
    this.eventBus.publish(new StimulatorDataEvent(data));
    // this.logger.debug('Zpráva ze stimulátoru...');
    // this.logger.debug(`[${data.join(',')}]`);
    // // Pomocí externí metody naparsuji data na interní třídu
    // const event: SerialDataEvent = parseData(data);
    // this.logger.verbose(event);
    // if (event === null) {
    //   this.logger.error('Událost nebyla rozpoznána!!!');
    //   this.logger.error(data);
    //   this.logger.debug(data.toString().trim());
    //   this.publishMessage(SERIAL_DATA, data.toString().trim());
    // } else {
    //   this._events.emit(event.name, event);
    //   this.publishMessage(SERIAL_DATA, event);
    // }
  }

  protected _handleSerialOpen() {
    this.eventBus.publish(new SerialOpenEvent());
  }

  protected _handleSerialClosed() {
    this.eventBus.publish(new SerialClosedEvent());
  }

  /**
   * Prozkoumá dostupné sériové porty a vrátí seznam cest k těmto portům
   */
  public abstract discover(): Promise<SerialPort.PortInfo[]>;

  /**
   * Otevře port na zadané cestě
   *
   * @param path Cesta k sériovému portu
   * @param settings Konfigurace portu, který se má otevřít
   */
  public abstract open(
    path: string,
    settings: SerialPort.OpenOptions
  ): Promise<void>;

  /**
   * Uzavře aktuálně otevřený port
   */
  public abstract close(): Promise<any>;

  /**
   * Zapíše data na sériový port
   *
   * @param buffer Buffer s daty, který se má zapsat na sériový port
   */
  public abstract write(buffer: Buffer): void;

  /**
   * Pokusí se otevřít poslední použitý port.
   * V případě neúspěchu aktualizuje nastavení.
   */
  public tryAutoopenComPort(): void {
    // if (this._settings.settings.autoconnectToStimulator && this._settings.settings.comPortName && !this.isConnected) {
    //   this.open(this._settings.settings.comPortName)
    //       .catch((reason) => {
    //         this.logger.error('Selhalo automatické otevření portu. Ruším autoconnect.');
    //         this.logger.error(reason);
    //         const settings = this._settings.settings;
    //         settings.autoconnectToStimulator = false;
    //         this._settings.updateSettings(settings).finally();
    //       });
    // }
  }

  /**
   * Vrátí true, pokud je seriová linka připojená, jinak false
   */
  public abstract get isConnected(): boolean;
}
