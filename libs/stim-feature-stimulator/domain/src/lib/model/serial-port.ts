export interface SerialPort {
  on(event: string, callback: (data?: any) => void): SerialPort;
  close(callback?: (error?: Error) => void): void;
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;

  write(data: string | number[] | Buffer, callback?: (error: Error, bytesWritten: number) => void): boolean;
}
