import { Provider } from '@nestjs/common';
import * as isCi from 'is-ci';

import { SettingsService } from '../settings/settings.service';
import { SerialService } from './serial.service';
import { FakeSerialService } from './fake-serial.service';
import { RealSerialService } from './real-serial.service';

export const serialProvider: Provider = {
  provide: SerialService,
  useFactory: (settings: SettingsService) => {
    return (process.env.VIRTUAL_SERIAL_SERVICE === 'true' || isCi)
      ? new FakeSerialService(settings)
      : new RealSerialService(settings);
  },
  inject: [SettingsService]
};
