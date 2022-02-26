import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileBrowserFacade } from './service/file-browser.facade';
import { StimFeatureFileBrowserInfrastructureCoreModule } from './stim-feature-file-browser-infrastructure-core.module';

@Module({})
export class StimFeatureFileBrowserInfrastructureModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserInfrastructureModule,
      imports: [
        StimFeatureFileBrowserInfrastructureCoreModule.forRootAsync()
      ]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserInfrastructureModule,
      imports: [
        CqrsModule
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
