import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureIpcApplicationModule } from '@neuro-server/stim-feature-ipc/application';

import { IpcController } from './controller/ipc.controller';
import { IpcFacade } from './service/ipc.facade';

@Global()
@Module({})
export class StimFeatureIpcInfrastructureCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureIpcInfrastructureCoreModule,
      controllers: [IpcController],
      imports: [CqrsModule, StimFeatureIpcApplicationModule.forRootAsync()],
      providers: [IpcFacade],
      exports: [IpcFacade],
    };
  }
}
