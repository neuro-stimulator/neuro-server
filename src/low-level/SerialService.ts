import { Injectable, Logger } from '@nestjs/common';

import * as SerialPort from 'serialport';


import { SerialGateway } from './SerialGateway';
import Readline = SerialPort.parsers.Readline;

@Injectable()
export class SerialService {

  private readonly logger = new Logger(SerialService.name);
  private readonly serial = new SerialPort('/dev/pts/4');

  constructor(private readonly _gateway: SerialGateway) {
    this.serial.on('data', data => {
      this.logger.log(data);
      this._gateway.sendData(data.toString().trim());
    });
  }
}
