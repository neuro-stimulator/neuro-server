import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { SettingsModule } from '../settings/settings.module';
import { SerialService } from './serial.service';
import { SerialGateway } from './serial.gateway';
import { LowLevelController } from './low-level.controller';
import { serialProvider } from './serial-provider';

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
    serialProvider,
    SerialGateway,
  ],
})
export class LowLevelModule {

}
