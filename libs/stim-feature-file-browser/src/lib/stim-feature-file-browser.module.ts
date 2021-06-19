import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { StimFeatureFileBrowserCoreModule } from './stim-feature-file-browser-core.module';

@Module({})
export class StimFeatureFileBrowserModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      imports: [StimFeatureFileBrowserCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      imports: [CqrsModule],
      providers: [FileBrowserFacade],
      exports: [FileBrowserFacade],
    };
  }
}
