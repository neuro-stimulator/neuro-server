import { SerialPort } from '@neuro-server/stim-feature-stimulator/domain';

export abstract class SerialPortFactory {

  /**
   * Vytvoří nové spojení se sériovým portem
   *
   * @param path string Cesta k sériovému portu
   * @param settings Nastavení
   * @param callback Funkce, která se zavolá po úspěšném otevření portu, nebo při chybě
   */
  abstract createSerialPort(path: string, settings: Record<string, unknown>, callback: (error?: Error | null) => void): SerialPort;

  /**
   * Vrátí seznam všech dostupných sériových portů
   */
  abstract list(): Promise<Record<string, unknown>[]>;
}
