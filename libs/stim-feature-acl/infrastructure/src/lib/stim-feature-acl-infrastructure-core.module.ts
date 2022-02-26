import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureAclApplicationModule } from '@neuro-server/stim-feature-acl/application';

import { AclController } from './controller/acl.controller';
import { AclFacade } from './service/acl.facade';

@Module({})
export class StimFeatureAclInfrastructureCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAclInfrastructureCoreModule,
      controllers: [AclController],
      imports: [CqrsModule, StimFeatureAclApplicationModule.forRootAsync()],
      providers: [AclFacade],
      exports: [AclFacade]
    }
  }

}
