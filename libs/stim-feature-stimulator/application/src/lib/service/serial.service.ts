import { DelimiterOptions, DelimiterParser } from '@serialport/parser-delimiter';

import { Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import {
  PortIsAlreadyOpenException,
  PortIsNotOpenException,
  PortIsUnableToCloseException,
  PortIsUnableToOpenException,
  SerialPort, SerialPortOpenSettings
} from '@neuro-server/stim-feature-stimulator/domain';

import { SerialClosedEvent } from '../events/impl/serial-closed.event';
import { SerialOpenEvent } from '../events/impl/serial-open.event';
import { StimulatorDataEvent } from '../events/impl/stimulator-data.event';
import { SerialPortFactory } from '../factory/serial-port.factory';

/**
 * Abstraktní třída poskytující služby kolem sériové linky
 */
export abstract class SerialService {
  protected readonly logger: Logger = new Logger(SerialService.name);

  protected _serial?: SerialPort;

  protected constructor(private readonly eventBus: EventBus, protected readonly factory: SerialPortFactory) {}

  /**
   * Handler na přijatá data ze seriové linky
   *
   * @param data Přijatá data v binární podobě
   */
  protected _handleIncommingData(data: Buffer): void {
    this.eventBus.publish(new StimulatorDataEvent(data));
  }

  protected _handleSerialOpen(path: string): void {
    this.logger.verbose('Sériový port byl úspěšně otevřen.');
    this.eventBus.publish(new SerialOpenEvent(path));
  }

  protected _handleSerialClosed(): void {
    this.logger.verbose('Sériový port byl úspěšně zavřen.');
    this.eventBus.publish(new SerialClosedEvent());
  }

  /**
   * Prozkoumá dostupné sériové porty a vrátí seznam cest k těmto portům
   */
  public async discover(): Promise<Record<string, unknown>[]> {
    this.logger.verbose('Vyhledávám dostupné sériové porty.');
    return this.factory.list();
  }

  /**
   * Otevře port na zadané cestě
   *
   * @param path Cesta k sériovému portu
   * @param settings Konfigurace portu, který se má otevřít
   */
  public open(path: string, settings: SerialPortOpenSettings): Promise<void> {
    this.logger.verbose('Otevírám sériový port.');
    // Jinak vrátím novou promisu
    return new Promise((resolve, reject) => {
      // Pokud již je vytvořená nějaká instance seriového portu
      if (this._serial !== undefined) {
        // Nebudu dál pokračovat a vyhodím vyjímku
        throw new PortIsAlreadyOpenException();
      }

      // Pokusím se vytvořit novou instanci seriového portu
      this._serial = this.factory.createSerialPort(path, settings, (error) => {
        if (error instanceof Error) {
          this.logger.error(error);
          this._serial = undefined;
          reject(new PortIsUnableToOpenException());
        } else {
          // Nad daty se vytvoří parser, který dokáže oddělit jednotlivé příkazy ze stimulátoru za pomocí delimiteru
          const parser = this._serial?.pipe(
            new DelimiterParser({
              delimiter: CommandFromStimulator.COMMAND_DELIMITER,
              includeDelimiter: false
            } as DelimiterOptions)
          );
          parser?.on('data', (data: Buffer) => this._handleIncommingData(data));
          this._serial?.on('close', () => {
            this._serial = undefined;
            this._handleSerialClosed();
          });
          this._handleSerialOpen(path);
          resolve();
        }
      });
    });
  }

  /**
   * Uzavře aktuálně otevřený port
   */
  public close(): Promise<void> {
    this.logger.verbose('Zavírám sériový port.');
    return new Promise<void>((resolve) => {
      if (!this.isConnected) {
        throw new PortIsNotOpenException();
      }
      this._serial?.close((error: Error | undefined) => {
        if (error) {
          this.logger.error(error);
          throw new PortIsUnableToCloseException();
        } else {
          resolve(undefined);
        }
      });
    });
  }

  /**
   * Zapíše data na sériový port
   *
   * @param buffer Buffer s daty, který se má zapsat na sériový port
   */
  public abstract write(buffer: Buffer): void;

  /**
   * Vrátí true, pokud je seriová linka připojená, jinak false
   */
  public get isConnected(): boolean {
    return this._serial !== undefined;
  }
}
