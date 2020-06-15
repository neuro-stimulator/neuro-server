import { Module, DynamicModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TOKEN_BASE_PATH } from './domain/tokens';
import { FileBrowserModuleConfig } from './domain/model/file-browser-module.config';
import { FileBrowserController } from './infrastructure/controllers/file-browser.controller';
import { FileBrowserFacade } from './infrastructure/service/file-browser.facade';
import { FileBrowserQueries } from './application/queries';
import { FileBrowserService } from './domain/service/file-browser.service';
import { FileBrowserCommands } from './application/commands';

@Module({
  controllers: [FileBrowserController],
  imports: [CqrsModule],
  providers: [
    FileBrowserService,
    FileBrowserFacade,
    ...FileBrowserQueries,
    ...FileBrowserCommands,
  ],
  exports: [],
})
export class StimFeatureFileBrowserModule {
  static forRoot(config: FileBrowserModuleConfig): DynamicModule {
    return {
      module: StimFeatureFileBrowserModule,
      providers: [
        {
          provide: TOKEN_BASE_PATH,
          useValue: config.basePath,
        },
      ],
    };
  }
}
