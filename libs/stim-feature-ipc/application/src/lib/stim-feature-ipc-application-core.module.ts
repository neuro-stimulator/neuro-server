import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandIdService, createCommandIdFactory } from '@diplomka-backend/stim-lib-common';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import {
  IpcModuleConfig,
  TOKEN_COMMUNICATION_PORT,
  TOKEN_FRAME_RATE,
  TOKEN_OPEN_PORT_AUTOMATICALLY,
  TOKEN_PATH_TO_MAIN,
  TOKEN_PATH_TO_PYTHON,
} from '@diplomka-backend/stim-feature-ipc/domain';

import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './event';
import { Sagas } from './sagas';
import { IpcService } from './services/ipc.service';

@Global()
@Module({})
export class StimFeatureIpcApplicationCoreModule {
  static forRoot(config: IpcModuleConfig): DynamicModule {
    return {
      module: StimFeatureIpcApplicationCoreModule,
      imports: [CqrsModule, StimLibSocketModule, StimFeatureSettingsModule.forFeature()],
      providers: [
        IpcService,
        {
          provide: CommandIdService,
          useFactory: createCommandIdFactory(StimFeatureIpcApplicationCoreModule.name),
        },
        {
          provide: TOKEN_PATH_TO_PYTHON,
          useValue: config.pathToPython,
        },
        {
          provide: TOKEN_PATH_TO_MAIN,
          useValue: config.pathToMain,
        },
        {
          provide: TOKEN_COMMUNICATION_PORT,
          useValue: config.communicationPort || 8080,
        },
        {
          provide: TOKEN_FRAME_RATE,
          useValue: config.frameRate || 60,
        },
        {
          provide: TOKEN_OPEN_PORT_AUTOMATICALLY,
          useValue: config.openPortAutomatically,
        },

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
        ...Sagas,
      ],
    };
  }
}
