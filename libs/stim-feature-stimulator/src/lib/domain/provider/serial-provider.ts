import { Provider } from '@nestjs/common';
import * as isCi from 'is-ci';

// import { SettingsService } from "../settings/settings.service";
import { SerialService } from '../service/serial.service';
import { FakeSerialResponder } from '../service/serial/fake/fake-serial-responder';
import { FakeSerialService } from '../service/serial/fake/fake-serial.service';
import { RealSerialService } from '../service/serial/real/real-serial.service';
import { EventBus } from '@nestjs/cqrs';

/**
 * Provider pro třídu SerialService.
 * Pokud je server spuštěn v CI, nebo s parametrem VIRTUAL_SERIAL_SERVICE,
 * použije se FakeSerialService. Za normálních okolností se využije implementace
 * reálného sériového portu.
 */
export const serialProvider: Provider = {
  provide: SerialService,
  useFactory: (
    eventBus: EventBus,
    fakeSerialResponder: FakeSerialResponder
  ) => {
    // Pokud je vynucená VIRTUAL_SERIAL_SERVICE, nebo se jedná o CI
    if (process.env.VIRTUAL_SERIAL_SERVICE === 'true' || isCi) {
      // Vytvoř novou instanci FakeSerialService
      const fakeSerialService: FakeSerialService = new FakeSerialService(
        eventBus
      );
      /*settings*/
      // Zaregistruj vlastní data handler, který zastupuje stimulátor
      const fakeSerialDataEmitter = fakeSerialService.registerFakeDataHandler(
        fakeSerialResponder
      );
      // Propoj fakeSerialDataEmitter, aby bylo možné generovat odpovědi z "fake" stimulátoru
      fakeSerialResponder.registerFakeDataEmitter(fakeSerialDataEmitter);
      return fakeSerialService;
    }

    return new RealSerialService(eventBus);
  },
  // Závislosti pro serialProvider
  // Důležitá je zejména třída FakeSerialResponder,
  // jejíž implementace obsahuje právě odpovědi na příkazy ze serveru
  inject: [EventBus, FakeSerialResponder],
};
