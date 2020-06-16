import { DynamicModule, Module } from '@nestjs/common';

import { FileBrowserController } from './infrastructure/controllers/file-browser.controller';
import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { FileBrowserQueries } from './application/queries';
import { FileBrowserService } from './domain/service/file-browser.service';
import { FileBrowserCommands } from './application/commands';
import { FileBrowserModuleConfig } from './domain/model/file-browser-module.config';
import { StimFeatureFileBrowserCoreModule } from './stim-feature-file-browser-core.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({})
export class StimFeatureFileBrowserModule {
  static forRoot(config: FileBrowserModuleConfig): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      imports: [StimFeatureFileBrowserCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      controllers: [FileBrowserController],
      imports: [CqrsModule],
      providers: [
        FileBrowserService,
        FileBrowserFacade,
        ...FileBrowserQueries,
        ...FileBrowserCommands,
      ],
      exports: [FileBrowserFacade],
    };
  }
}
