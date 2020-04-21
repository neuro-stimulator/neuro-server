import { Provider } from '@nestjs/common';
import * as isCi from 'is-ci';

import { SettingsService } from '../settings/settings.service';
import { SerialService } from './serial.service';
import { FakeSerialService } from './fake-serial/fake-serial.service';
import { RealSerialService } from './real-serial.service';
import { DefaultFakeSerialResponder } from './fake-serial/fake-serial.positive-responder';
import { FakeSerialResponder } from './fake-serial/fake-serial-responder';

export const serialProvider: Provider = {
  provide: SerialService,
  useFactory: (settings: SettingsService, fakeSerialResponder: FakeSerialResponder) => {
    if (process.env.VIRTUAL_SERIAL_SERVICE === 'true' || isCi) {
        const fakeSerialService: FakeSerialService = new FakeSerialService(settings);
        const fakeSerialDataEmitter = fakeSerialService.registerFakeDataHandler(fakeSerialResponder);
        fakeSerialResponder.registerFakeDataEmitter(fakeSerialDataEmitter);
        return fakeSerialService;
    }

    return new RealSerialService(settings);
  },
  inject: [SettingsService, FakeSerialResponder]
};
