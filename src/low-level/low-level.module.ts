import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { SettingsModule } from '../settings/settings.module';
import { SerialService } from './serial.service';
import { SerialGateway } from './serial.gateway';
import { LowLevelController } from './low-level.controller';
import { serialProvider } from './serial-provider';
import { FakeSerialResponder } from './fake-serial/fake-serial-responder';
import { DefaultFakeSerialResponder } from './fake-serial/fake-serial.positive-responder';

@Module({
  controllers: [
    LowLevelController,
  ],
  imports: [
    MulterModule.register({
      // dest: '/tmp/private/firmware'
      dest: FileBrowserService.mergePrivatePath('firmware')
    }),
    SettingsModule
  ],
  exports: [
    SerialService
  ],
  providers: [
    {
      provide: FakeSerialResponder,
      useValue: new DefaultFakeSerialResponder()
    },
    serialProvider,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
