import { DynamicModule, Module } from '@nestjs/common';

import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { FileBrowserModuleConfig } from './domain/model/file-browser-module.config';
import { StimFeatureFileBrowserCoreModule } from './stim-feature-file-browser-core.module';

@Module({})
export class StimFeatureFileBrowserModule {
  static forRoot(config: FileBrowserModuleConfig): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      imports: [StimFeatureFileBrowserCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      providers: [FileBrowserFacade],
      exports: [FileBrowserFacade],
    };
  }
}
