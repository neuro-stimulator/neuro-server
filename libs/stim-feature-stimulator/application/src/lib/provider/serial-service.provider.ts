import { Provider } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { STIMULATOR_MODULE_CONFIG_CONSTANT, StimulatorModuleConfig } from '@neuro-server/stim-feature-stimulator/domain';

import { SerialService } from '../service/serial.service';
import { FakeSerialResponder } from '../service/serial/fake/fake-serial-responder';
import { FakeSerialService } from '../service/serial/fake/fake-serial.service';
import { RealSerialService } from '../service/serial/real/real-serial.service';
import { SerialPortFactory } from '../factory/serial-port.factory';

/**
 * Provider pro třídu SerialService.
 * Pokud je server spuštěn v CI, nebo s parametrem VIRTUAL_SERIAL_SERVICE,
 * použije se FakeSerialService. Za normálních okolností se využije implementace
 * reálného sériového portu.
 */
export const serialServiceProvider: Provider = {
  provide: SerialService,
  useFactory: (eventBus: EventBus, factory: SerialPortFactory, fakeSerialResponder: FakeSerialResponder, config: StimulatorModuleConfig): SerialService => {
    // Pokud je vynucená VIRTUAL_SERIAL_SERVICE, nebo se jedná o CI
    if (config.virtualSerialService) {
      // Vytvoř novou instanci FakeSerialService
      const fakeSerialService: FakeSerialService = new FakeSerialService(eventBus, factory);
      // Zaregistruj vlastní data handler, který zastupuje stimulátor
      const fakeSerialDataEmitter = fakeSerialService.registerFakeDataHandler(fakeSerialResponder);
      // Propoj fakeSerialDataEmitter, aby bylo možné generovat odpovědi z "fake" stimulátoru
      fakeSerialResponder.registerFakeDataEmitter(fakeSerialDataEmitter);
      return fakeSerialService;
    }

    return new RealSerialService(eventBus, factory);
  },
  // Závislosti pro serialProvider
  // Důležitá je zejména třída FakeSerialResponder,
  // jejíž implementace obsahuje právě odpovědi na příkazy ze serveru
  inject: [EventBus, SerialPortFactory, FakeSerialResponder, STIMULATOR_MODULE_CONFIG_CONSTANT],
};
