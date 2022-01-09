import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureFileBrowserDomainModule } from '@neuro-server/stim-feature-file-browser/domain';

import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { Sagas } from './saga';
import { FileBrowserService } from './service/file-browser.service';

@Module({})
export class StimFeatureFileBrowserApplicationCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureFileBrowserApplicationCoreModule,
      imports: [
        CqrsModule,
        StimFeatureFileBrowserDomainModule.forRootAsync()
      ],
      providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
        ...Sagas,
        FileBrowserService
      ]
    }
  }

}
