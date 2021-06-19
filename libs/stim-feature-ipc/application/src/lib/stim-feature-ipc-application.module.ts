import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureIpcApplicationCoreModule } from './stim-feature-ipc-application-core.module';
import { IpcService } from './services/ipc.service';

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
