import { Provider } from '@nestjs/common';
import * as isCi from 'is-ci';

import { SettingsService } from '../settings/settings.service';
import { SerialService } from './serial.service';
import { FakeSerialService } from './fake-serial/fake-serial.service';
import { RealSerialService } from './real-serial.service';
import { DefaultFakeSerialResponder } from './fake-serial/fake-serial.positive-responder';
import { FakeSerialResponder } from './fake-serial/fake-serial-responder';

/**
 * Provider pro třídu SerialService.
 * Pokud je server spuštěn v CI, nebo s parametrem VIRTUAL_SERIAL_SERVICE,
 * použije se FakeSerialService. Za normálních okolností se využije implementace
 * reálného sériového portu.
 */
export const serialProvider: Provider = {
  provide: SerialService,
  useFactory: (settings: SettingsService, fakeSerialResponder: FakeSerialResponder) => {
    // Pokud je vynucená VIRTUAL_SERIAL_SERVICE, nebo se jedná o CI
    if (process.env.VIRTUAL_SERIAL_SERVICE === 'true' || isCi) {
      // Vytvoř novou instanci FakeSerialService
      const fakeSerialService: FakeSerialService = new FakeSerialService(settings);
      // Zaregistruj vlastní data handler, který zastupuje stimulátor
      const fakeSerialDataEmitter = fakeSerialService.registerFakeDataHandler(fakeSerialResponder);
      // Propoj fakeSerialDataEmitter, aby bylo možné generovat odpovědi z "fake" stimulátoru
      fakeSerialResponder.registerFakeDataEmitter(fakeSerialDataEmitter);
      return fakeSerialService;
    }

    return new RealSerialService(settings);
  },
  // Závislosti pro serialProvider
  // Důležitá je zejména třída FakeSerialResponder,
  // jejíž implementace obsahuje právě odpovědi na příkazy ze serveru
  inject: [SettingsService, FakeSerialResponder]
};
