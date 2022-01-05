import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureFileBrowserDomainCoreModule } from './stim-feature-file-browser-domain-core.module';

@Module({})
export class StimFeatureFileBrowserDomainModule {

    static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserDomainModule,
      imports: [StimFeatureFileBrowserDomainCoreModule.forRootAsync()]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserDomainModule
    };
  }

}
