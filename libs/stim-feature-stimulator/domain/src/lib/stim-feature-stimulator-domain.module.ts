import { DynamicModule, Module } from '@nestjs/common';

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
    }
  }

}
