import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureIpcDomainModule } from '@neuro-server/stim-feature-ipc/domain';
import { StimFeatureSettingsModule } from '@neuro-server/stim-feature-settings';
import { CommandIdService, createCommandIdFactory } from '@neuro-server/stim-lib-common';
import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';

import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { QueryHandlers } from './queries';
import { Sagas } from './sagas';
import { IpcService } from './services/ipc.service';

@Global()
@Module({})
export class StimFeatureIpcApplicationCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureIpcApplicationCoreModule,
      imports: [CqrsModule, StimFeatureIpcDomainModule.forRootAsync(), StimLibSocketModule, StimFeatureSettingsModule.forFeature()],
      providers: [
        IpcService,
        {
          provide: CommandIdService,
          useFactory: createCommandIdFactory(StimFeatureIpcApplicationCoreModule.name),
        },

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
        ...Sagas,
      ],
    };
  }
}
