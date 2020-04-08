import * as SerialPort from 'serialport';

/**
 * Abstraktní třída poskytující služby kolem sériové linky
 */
export abstract class SerialService {

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
  public abstract bindEvent(name: string, listener: (data: any) => void): void;

  /**
   * Odregistruje posluchače ze zadané události
   *
   * @param name Název události
   * @param listener Posluchač, který už se nemá volat
   */
  public abstract unbindEvent(name: string, listener: (data: any) => void): void;

  /**
   * Pokusí se otevřít poslední použitý port.
   * V případě neúspěchu aktualizuje nastavení.
   */
  public abstract tryAutoopenComPort(): void;

  /**
   * Zaregistruje službu pro publikování zpráv
   *
   * @param messagePublisher MessagePublisher
   */
  public abstract registerMessagePublisher(messagePublisher: (topic: string, data: any) => void): void;

  /**
   * Odešle zprávu pomocí MessagePublishera
   *
   * @param topic Téma zprávy
   * @param data Data zprávy
   */
  public abstract publishMessage(topic: string, data: any): void;

  /**
   * Vrátí true, pokud je seriová linka připojená, jinak false
   */
  public abstract get isConnected(): boolean;
}
