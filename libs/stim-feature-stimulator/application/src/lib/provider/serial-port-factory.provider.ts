import { Provider } from '@nestjs/common';

import { STIMULATOR_MODULE_CONFIG_CONSTANT, StimulatorModuleConfig } from '@neuro-server/stim-feature-stimulator/domain';

import { SerialPortFactory } from '../factory/serial-port.factory';
import { FakeSerialPortFactory } from '../factory/fake-serial-port.factory';
import { RealSerialPortFactory } from '../factory/real-serial-port.factory';

export const serialPortFactoryProvider: Provider = {
  provide: SerialPortFactory,
  useFactory: (config: StimulatorModuleConfig): SerialPortFactory => {
    // Pokud je vynucená VIRTUAL_SERIAL_SERVICE, nebo se jedná o CI
    if (config.virtualSerialService) {
      // Vrátím fake serial port factory
      return new FakeSerialPortFactory();
    } else {
      // Jinak vrátím továrnu na reálný sériový port
      return new RealSerialPortFactory();
    }
  },
  inject: [STIMULATOR_MODULE_CONFIG_CONSTANT],
};
