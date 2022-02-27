import { AutoDetectTypes } from '@serialport/bindings-cpp';
import { SerialPortOpenOptions } from 'serialport';

export type SerialPortOpenSettings = SerialPortOpenOptions<AutoDetectTypes>;

export interface SerialPort {

  on(event: string, callback: (data?: unknown) => void): SerialPort;
  close(callback: (error?: Error) => void): void;
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;

  write(chunk: unknown, encoding?: BufferEncoding, cb?: (error: Error | null | undefined) => void): boolean;
}
