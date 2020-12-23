import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileBrowserController } from './infrastructure/controller/file-browser.controller';
import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { FileBrowserModuleConfig } from './domain/model/file-browser-module.config';
import { FileBrowserService } from './domain/service/file-browser.service';
import { TOKEN_BASE_PATH } from './domain/tokens/tokens';
import { FileBrowserQueries } from './application/queries';
import { FileBrowserCommands } from './application/commands';
import { EventHandlers } from './application/events';

@Global()
@Module({})
export class StimFeatureFileBrowserCoreModule {
  static forRoot(config: FileBrowserModuleConfig): DynamicModule {
    return {
      module: StimFeatureFileBrowserCoreModule,
      controllers: [FileBrowserController],
      imports: [CqrsModule],
      providers: [
        {
          provide: TOKEN_BASE_PATH,
          useValue: config.basePath,
        },
        FileBrowserService,
        FileBrowserFacade,

        ...FileBrowserQueries,
        ...FileBrowserCommands,
        ...EventHandlers,
      ],
      exports: [TOKEN_BASE_PATH],
    };
  }
}
