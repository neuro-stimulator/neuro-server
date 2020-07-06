import * as SerialPort from 'serialport';
import { Logger } from '@nestjs/common';

import { EventBus } from '@nestjs/cqrs';

import { StimulatorDataEvent } from '../events/impl/stimulator-data.event';
import { SerialOpenEvent } from '../events/impl/serial-open.event';
import { SerialClosedEvent } from '../events/impl/serial-closed.event';

/**
 * Abstraktní třída poskytující služby kolem sériové linky
 */
export abstract class SerialService {
  protected readonly logger: Logger = new Logger(SerialService.name);

  protected constructor(private readonly eventBus: EventBus) {}

  /**
   * Handler na přijatá data ze seriové linky
   *
   * @param data Přijatá data v binární podobě
   */
  protected _handleIncommingData(data: Buffer) {
    this.eventBus.publish(new StimulatorDataEvent(data));
  }

  protected _handleSerialOpen(path: string) {
    this.logger.verbose('Sériový port byl úspěšně otevřen.');
    this.eventBus.publish(new SerialOpenEvent(path));
  }

  protected _handleSerialClosed() {
    this.logger.verbose('Sériový port byl úspěšně zavřen.');
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
  public abstract open(path: string, settings: SerialPort.OpenOptions): Promise<void>;

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
   * Vrátí true, pokud je seriová linka připojená, jinak false
   */
  public abstract get isConnected(): boolean;
}
