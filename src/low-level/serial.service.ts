import * as SerialPort from 'serialport';
import * as events from 'events';

import { Logger } from '@nestjs/common';

import { SettingsService } from '../settings/settings.service';
import { MessagePublisher } from '../share/utils';
import { SerialDataEvent } from '@stechy1/diplomka-share';
import { parseData } from './protocol/data-parser.protocol';
import { SERIAL_DATA } from './serial.gateway.protocol';

/**
 * Abstraktní třída poskytující služby kolem sériové linky
 */
export abstract class SerialService implements MessagePublisher {

  protected readonly logger: Logger = new Logger(SerialService.name);

  protected readonly _events: events.EventEmitter = new events.EventEmitter();

  private _publishMessage: (topic: string, data: any) => void;

  protected constructor(protected readonly _settings: SettingsService) {}

  protected _saveComPort(path: string) {
    // Vytvořím si hlubokou kopii nastavení
    const settings = {...this._settings.settings};
    // Pokud je poslední uložená cesta ke COM portu stejná, nebudu nic ukládat.
    if (settings.comPortName === path) {
      return;
    }

    // COM port je jiný, než ten, co byl posledně použitý
    settings.comPortName = path;
    this._settings.updateSettings(settings).finally();
  }

  protected _handleIncommingData(data: Buffer) {
    this.logger.debug('Zpráva ze stimulátoru...');
    this.logger.debug(data);
    const event: SerialDataEvent = parseData(data);
    this.logger.verbose(event);
    if (event === null) {
      this.logger.error('Událost nebyla rozpoznána!!!');
      this.logger.error(data);
      this.logger.debug(data.toString().trim());
      this.publishMessage(SERIAL_DATA, data.toString().trim());
    } else {
      this._events.emit(event.name, event);
      this.publishMessage(SERIAL_DATA, event);
    }
  }

  /**
   * Prozkoumá dostupné sériové porty a vrátí seznam cest k těmto portům
   */
  public abstract discover(): Promise<SerialPort.PortInfo[]>;

  /**
   * Otevře port na zadané cestě
   *
   * @param path Cesta k sériovému portu
   */
  public abstract open(path: string): Promise<void>;

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
   * Zaregistruje posluchače k přijímání událostí
   *
   * @param name Název události
   * @param listener Posluchač, který se bude volat v příadě výskytu události
   */
  public bindEvent(name: string, listener: (data: any) => void): void {
    this._events.on(name, listener);
  }

  /**
   * Odregistruje posluchače ze zadané události
   *
   * @param name Název události
   * @param listener Posluchač, který už se nemá volat
   */
  public unbindEvent(name: string, listener: (data: any) => void): void {
    this._events.removeListener(name, listener);
  }

  /**
   * Pokusí se otevřít poslední použitý port.
   * V případě neúspěchu aktualizuje nastavení.
   */
  public tryAutoopenComPort(): void {
    if (this._settings.settings.autoconnectToStimulator && this._settings.settings.comPortName && !this.isConnected) {
      this.open(this._settings.settings.comPortName)
          .catch((reason) => {
            this.logger.error('Selhalo automatické otevření portu. Ruším autoconnect.');
            this.logger.error(reason);
            const settings = this._settings.settings;
            settings.autoconnectToStimulator = false;
            this._settings.updateSettings(settings).finally();
          });
    }
  }

  /**
   * Zaregistruje službu pro publikování zpráv
   *
   * @param messagePublisher MessagePublisher
   */
  public registerMessagePublisher(messagePublisher: (topic: string, data: any) => void): void {
    this._publishMessage = messagePublisher;
  }

  /**
   * Odešle zprávu pomocí MessagePublishera
   *
   * @param topic Téma zprávy
   * @param data Data zprávy
   */
  public publishMessage(topic: string, data: any): void {
    this._publishMessage(topic, data);
  }

  /**
   * Vrátí true, pokud je seriová linka připojená, jinak false
   */
  public abstract get isConnected(): boolean;
}
