import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureAclDomainCoreModule } from './stim-feature-acl-domain-core.module';

@Module({})
export class StimFeatureAclDomainModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAclDomainModule,
      imports: [StimFeatureAclDomainCoreModule.forRootAsync()]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAclDomainModule
    };
  }

}
