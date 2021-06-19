import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseAsyncConfigModule } from '@diplomka-backend/stim-lib-config';

import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleAsyncConfig, AssetPlayerModuleConfig, AssetPlayerModuleConfigFactoryImpl } from './config';

@Global()
@Module({})
export class StimFeatureIpcDomainCoreModule {
  static forRootAsync(): DynamicModule {
        const configProvider = BaseAsyncConfigModule.forRootAsync<AssetPlayerModuleAsyncConfig, AssetPlayerModuleConfig>({
      name: ASSET_PLAYER_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new AssetPlayerModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    });

    return {
      module: StimFeatureIpcDomainCoreModule,
      imports: [configProvider],
      exports: [configProvider]
    }
  }
}
