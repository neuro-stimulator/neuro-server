import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { STIMULATOR_MODULE_CONFIG_CONSTANT, StimulatorModuleAsyncConfig, StimulatorModuleConfig, StimulatorModuleConfigFactoryImpl } from './config';
import { PROTOCOL_PROVIDERS } from './model/protocol';

@Global()
@Module({})
export class StimFeatureStimulatorDomainCoreModule {
  static forRootAsync(): DynamicModule {
    const configProvider = BaseAsyncConfigModule.forRootAsync<StimulatorModuleAsyncConfig, StimulatorModuleConfig>({
      name: STIMULATOR_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new StimulatorModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimFeatureStimulatorDomainCoreModule,
      imports: [
        configProvider
      ],
      providers: [
        ...PROTOCOL_PROVIDERS
      ],
      exports: [
        BaseAsyncConfigModule,
        ...PROTOCOL_PROVIDERS
      ]
    };
  }
}
