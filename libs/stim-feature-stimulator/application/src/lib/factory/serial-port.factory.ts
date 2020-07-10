import { SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';

export abstract class SerialPortFactory {
  abstract createSerialPort(path: string, settings: any, callback: (error) => void): SerialPort;

  abstract list(): Promise<any[]>;
}
