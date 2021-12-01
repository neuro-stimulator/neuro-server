import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AclFacade } from './service/acl.facade';
import { StimFeatureAclInfrastructureCoreModule } from './stim-feature-acl-infrastructure-core.module';

@Module({})
export class StimFeatureAclInfrastructureModule {

    static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAclInfrastructureModule,
      imports: [StimFeatureAclInfrastructureCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAclInfrastructureModule,
      imports: [CqrsModule],
      providers: [AclFacade],
      exports: [AclFacade],
    };
  }

}
