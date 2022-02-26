import { DynamicModule, Module } from '@nestjs/common';

import { PROTOCOL_PROVIDERS } from './model/protocol';
import { StimFeatureStimulatorDomainCoreModule } from './stim-feature-stimulator-domain-core.module';

@Module({})
export class StimFeatureStimulatorDomainModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureStimulatorDomainModule,
      imports: [StimFeatureStimulatorDomainCoreModule.forRootAsync()]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureStimulatorDomainModule,
      providers: [
        ...PROTOCOL_PROVIDERS
      ],
      exports: [
        ...PROTOCOL_PROVIDERS
      ]
    }
  }

}
