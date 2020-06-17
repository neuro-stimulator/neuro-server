import { DynamicModule, Global, Module } from '@nestjs/common';

import { FileBrowserModuleConfig } from './domain/model/file-browser-module.config';
import { TOKEN_BASE_PATH } from './domain/tokens';

@Global()
@Module({})
export class StimFeatureFileBrowserCoreModule {
  static forRoot(config: FileBrowserModuleConfig): DynamicModule {
    return {
      module: StimFeatureFileBrowserCoreModule,
      providers: [
        {
          provide: TOKEN_BASE_PATH,
          useValue: config.basePath,
        },
      ],
      exports: [TOKEN_BASE_PATH],
    };
  }
}
