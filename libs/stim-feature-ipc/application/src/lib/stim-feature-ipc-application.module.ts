import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandIdService, createCommandIdFactory } from '@diplomka-backend/stim-lib-common';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';

import { IpcService } from './services/ipc.service';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { Sagas } from './sagas';

@Module({
  imports: [CqrsModule, StimLibSocketModule, StimFeatureSettingsModule.forFeature()],
  providers: [
    IpcService,
    {
      provide: CommandIdService,
      useFactory: createCommandIdFactory(StimFeatureIpcApplicationModule.name),
    },
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
    ...Sagas,
  ],
  exports: [],
})
export class StimFeatureIpcApplicationModule {}
