import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureStimulatorApplicationCoreModule } from './stim-feature-stimulator-application-core.module';

@Module({})
export class StimFeatureStimulatorApplicationModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureStimulatorApplicationModule,
      imports: [StimFeatureStimulatorApplicationCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureStimulatorApplicationModule,
    };
  }
}
