import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { BaseAsyncConfigModule } from '@neuro-server/stim-lib-config';

import { FileBrowserController } from './infrastructure/controller/file-browser.controller';
import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { FILE_BROWSER_MODULE_CONFIG_CONSTANT, FileBrowserModuleAsyncConfig, FileBrowserModuleConfig, FileBrowserModuleConfigFactoryImpl } from './domain/config';
import { FileBrowserService } from './domain/service/file-browser.service';
import { FileBrowserQueries } from './application/queries';
import { FileBrowserCommands } from './application/commands';
import { EventHandlers } from './application/events';

@Global()
@Module({})
export class StimFeatureFileBrowserCoreModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserCoreModule,
      controllers: [FileBrowserController],
      imports: [
        CqrsModule,
        BaseAsyncConfigModule.forRootAsync<FileBrowserModuleAsyncConfig, FileBrowserModuleConfig>({
          name: FILE_BROWSER_MODULE_CONFIG_CONSTANT,
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => new FileBrowserModuleConfigFactoryImpl(config),
          inject: [ConfigService]
        })],
      providers: [
        FileBrowserService,
        FileBrowserFacade,

        ...FileBrowserQueries,
        ...FileBrowserCommands,
        ...EventHandlers
      ],
    };
  }
}
