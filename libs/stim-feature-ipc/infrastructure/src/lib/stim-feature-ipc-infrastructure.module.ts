import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { IpcModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';

import { IpcController } from './controller/ipc.controller';
import { IpcFacade } from './service/ipc.facade';
import { StimFeatureIpcInfrastructureCoreModule } from './stim-feature-ipc-infrastructure-core.module';

@Module({})
export class StimFeatureIpcInfrastructureModule {
  static forRoot(config: IpcModuleConfig): DynamicModule {
    return {
      module: StimFeatureIpcInfrastructureModule,
      imports: [StimFeatureIpcInfrastructureCoreModule.forRoot(config)],
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
