import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { FileBrowserService } from '../file-browser/file-browser.service';
import { SettingsModule } from '../settings/settings.module';
import { FileBrowserModule } from '../file-browser/file-browser.module';
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
    MulterModule.registerAsync({
      imports: [FileBrowserModule],
      inject: [FileBrowserService],
      useFactory: (fileBrowser: FileBrowserService): MulterOptions => {
        return {
          dest: fileBrowser.mergePrivatePath('firmware')
        };
      }
    }),
    SettingsModule,
    FileBrowserModule
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
