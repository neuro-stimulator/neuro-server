import { SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';

export abstract class SerialPortFactory {
  abstract createSerialPort(path: string, settings: Record<string, unknown>, callback: (error?: Error | null) => void): SerialPort;

  abstract list(): Promise<Record<string, unknown>[]>;
}
