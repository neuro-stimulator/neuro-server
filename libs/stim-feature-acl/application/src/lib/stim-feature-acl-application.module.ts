import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureAclApplicationCoreModule } from './stim-feature-acl-application-core.module';

@Module({})
export class StimFeatureAclApplicationModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAclApplicationModule,
      imports: [StimFeatureAclApplicationCoreModule.forRootAsync()]
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAclApplicationModule
    };
  }

}
