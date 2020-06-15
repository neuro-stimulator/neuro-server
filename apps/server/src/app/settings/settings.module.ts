import { Module } from '@nestjs/common';

import { FileBrowserModule } from '../file-browser/file-browser.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

// @Module({
//   controllers: [
//     SettingsController
//   ],
//   providers: [
//     SettingsService
//   ],
//   imports: [
//     FileBrowserModule
//   ],
//   exports: [
//     SettingsService
//   ]
// })
export class SettingsModule {}
