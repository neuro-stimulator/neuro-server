import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { IpcModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';
import { StimFeatureIpcApplicationModule } from '@diplomka-backend/stim-feature-ipc/application';

import { IpcFacade } from './service/ipc.facade';
import { IpcController } from './controller/ipc.controller';

@Global()
@Module({})
export class StimFeatureIpcInfrastructureCoreModule {
  static forRoot(config: IpcModuleConfig): DynamicModule {
    return {
      module: StimFeatureIpcInfrastructureCoreModule,
      controllers: [IpcController],
      imports: [CqrsModule, StimFeatureIpcApplicationModule.forRoot(config)],
      providers: [IpcFacade],
      exports: [IpcFacade],
    };
  }
}
