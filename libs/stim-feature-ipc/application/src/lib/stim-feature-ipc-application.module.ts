import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { IpcModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';

import { StimFeatureIpcApplicationCoreModule } from './stim-feature-ipc-application-core.module';
import { IpcService } from './services/ipc.service';

@Module({})
export class StimFeatureIpcApplicationModule {
  static forRoot(config: IpcModuleConfig): DynamicModule {
    return {
      module: StimFeatureIpcApplicationModule,
      imports: [StimFeatureIpcApplicationCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureIpcApplicationModule,
      imports: [CqrsModule],
      providers: [IpcService],
    };
  }
}
