import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { FILE_BROWSER_MODULE_CONFIG_CONSTANT, FileBrowserModuleAsyncConfig, FileBrowserModuleConfig, FileBrowserModuleConfigFactoryImpl } from './config';

@Global()
@Module({})
export class StimFeatureFileBrowserDomainCoreModule {

  static forRootAsync(): DynamicModule {
    const configProvider = BaseAsyncConfigModule.forRootAsync<FileBrowserModuleAsyncConfig, FileBrowserModuleConfig>({
      name: FILE_BROWSER_MODULE_CONFIG_CONSTANT,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => new FileBrowserModuleConfigFactoryImpl(config),
      inject: [ConfigService]
    })

    return {
      module: StimFeatureFileBrowserDomainCoreModule,
      imports: [
        configProvider
      ],
      providers: [],
      exports: [
        BaseAsyncConfigModule,
      ]
    }
  }

}
