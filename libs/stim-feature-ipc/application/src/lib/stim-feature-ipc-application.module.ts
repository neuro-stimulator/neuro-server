import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { IpcService } from './services/ipc.service';
import { StimFeatureIpcApplicationCoreModule } from './stim-feature-ipc-application-core.module';

@Module({})
export class StimFeatureIpcApplicationModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureIpcApplicationModule,
      imports: [StimFeatureIpcApplicationCoreModule.forRootAsync()],
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
