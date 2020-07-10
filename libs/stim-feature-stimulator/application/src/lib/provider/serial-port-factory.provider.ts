import * as isCi from 'is-ci';
import { Provider } from '@nestjs/common';

import { TOKEN_USE_VIRTUAL_SERIAL_FACTORY } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialPortFactory } from '../factory/serial-port.factory';
import { FakeSerialPortFactory } from '../factory/fake-serial-port.factory';
import { RealSerialPortFactory } from '../factory/real-serial-port.factory';

export const serialPortFactoryProvider: Provider = {
  provide: SerialPortFactory,
  useFactory: (useVirtualSerial: boolean): SerialPortFactory => {
    // Pokud je vynucená VIRTUAL_SERIAL_SERVICE, nebo se jedná o CI
    if (useVirtualSerial || isCi) {
      // Vrátím fake serial port factory
      return new FakeSerialPortFactory();
    } else {
      // Jinak vrátím továrnu na reálný sériový port
      return new RealSerialPortFactory();
    }
  },
  inject: [TOKEN_USE_VIRTUAL_SERIAL_FACTORY],
};
