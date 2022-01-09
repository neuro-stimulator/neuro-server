import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserApplicationModule } from '@neuro-server/stim-feature-file-browser/application';

import { FileBrowserController } from './controller/file-browser.controller';
import { FileBrowserFacade } from './service/file-browser.facade';

@Module({})
export class StimFeatureFileBrowserInfrastructureCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserInfrastructureCoreModule,
      controllers: [
        FileBrowserController
      ],
      imports: [
        CqrsModule,
        StimFeatureFileBrowserApplicationModule.forRootAsync()
      ],
      providers: [
        FileBrowserFacade
      ],
      exports: [
        FileBrowserFacade
      ]
    }
  }

}
