import { transports as WinstonTransports } from 'winston';

import { ConsoleTransportOptions } from './transport-options';

export class ConsoleTransport extends WinstonTransports.Console {

  private readonly label?: string

  constructor(readonly options: ConsoleTransportOptions) {
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
