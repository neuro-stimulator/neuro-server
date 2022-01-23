import * as DailyRotateFile from 'winston-daily-rotate-file';

import { FileTransportOptions } from './transport-options';

export class FileTransport extends DailyRotateFile {

  private readonly label?: string

  constructor(readonly options: FileTransportOptions) {
    super(options);
    this.label = options.label;
  }

  log(info: any, callback: () => void): void {
    if (!this.label || this.label === info.label) {
      return super.log(info, callback);
    }
    // žádné zalogování
    callback();
  }

  logv(info: any, callback: () => void): void {
    if (!this.label || this.label === info.label) {
      return super.logv(info, callback);
    }
    // žádné zalogování
    callback();
  }
}
