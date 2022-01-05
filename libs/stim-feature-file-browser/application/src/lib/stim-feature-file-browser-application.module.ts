import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureFileBrowserApplicationCoreModule } from './stim-feature-file-browser-application-core.module';

@Module({})
export class StimFeatureFileBrowserApplicationModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserApplicationModule,
      imports: [StimFeatureFileBrowserApplicationCoreModule.forRootAsync()]
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserApplicationModule
    };
  }

}
