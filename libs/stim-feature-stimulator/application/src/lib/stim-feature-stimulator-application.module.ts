import { DynamicModule, Module } from '@nestjs/common';
import { StimulatorModuleConfig } from '@diplomka-backend/stim-feature-stimulator/domain';
import { StimFeatureStimulatorApplicationCoreModule } from './stim-feature-stimulator-application-core.module';

@Module({})
export class StimFeatureStimulatorApplicationModule {
  static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorApplicationModule,
      imports: [StimFeatureStimulatorApplicationCoreModule.forRoot(config)],
    };
  }
}
