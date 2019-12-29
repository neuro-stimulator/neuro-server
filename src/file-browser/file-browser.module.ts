import { Module } from '@nestjs/common';

import { FileBrowserController } from './file-browser.controller';
import { FileBrowserService } from './file-browser.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [
    FileBrowserController
  ],
  imports: [
    MulterModule.register({
      dest: '/tmp/private/uploads'
    })
  ],
  providers: [
    FileBrowserService
  ]
})
export class FileBrowserModule {

}
