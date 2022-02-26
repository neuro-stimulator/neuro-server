import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureAclDomainModule } from '@neuro-server/stim-feature-acl/domain';

import { COMMANDS } from './command';
import { EVENTS } from './event';
import { GUARDS } from './guard';
import { AclGuard } from './guard/acl.guard';
import { HANDLERS } from './query';
import { SAGAS } from './saga';
import { AclService } from './service/acl.service';

@Module({})
export class StimFeatureAclApplicationCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAclApplicationCoreModule,
      imports: [CqrsModule, StimFeatureAclDomainModule.forRootAsync()],
      providers: [
        {
          provide: APP_GUARD,
          useExisting: AclGuard
        },
        ...GUARDS,
        ...HANDLERS,
        ...COMMANDS,
        ...EVENTS,
        ...SAGAS,
        AclService
      ]
    }
  }

}
