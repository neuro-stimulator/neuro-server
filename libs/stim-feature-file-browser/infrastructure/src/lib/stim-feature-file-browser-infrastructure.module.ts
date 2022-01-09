import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserInfrastructureCoreModule } from './stim-feature-file-browser-infrastructure-core.module';
import { FileBrowserFacade } from './service/file-browser.facade';

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
