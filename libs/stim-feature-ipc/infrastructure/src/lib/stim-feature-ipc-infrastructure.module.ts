import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { IpcController } from './controller/ipc.controller';
import { IpcFacade } from './service/ipc.facade';
import { StimFeatureIpcInfrastructureCoreModule } from './stim-feature-ipc-infrastructure-core.module';

@Module({})
export class StimFeatureIpcInfrastructureModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureIpcInfrastructureModule,
      imports: [StimFeatureIpcInfrastructureCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureIpcInfrastructureModule,
      imports: [CqrsModule],
      providers: [IpcController, IpcFacade],
      exports: [IpcFacade],
    };
  }
}
