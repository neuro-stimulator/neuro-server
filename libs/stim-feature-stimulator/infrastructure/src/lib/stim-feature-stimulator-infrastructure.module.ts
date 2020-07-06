import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimulatorFacade } from './service/stimulator.facade';
import { StimulatorModuleConfig } from '@diplomka-backend/stim-feature-stimulator/domain';
import { StimFeatureStimulatorInfrastructureCoreModule } from './stim-feature-stimulator-infrastructure-core.module';

@Module({})
export class StimFeatureStimulatorInfrastructureModule {
  static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorInfrastructureModule,
      imports: [StimFeatureStimulatorInfrastructureCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureStimulatorInfrastructureModule,
      imports: [CqrsModule],
      providers: [StimulatorFacade],
      exports: [StimulatorFacade],
    };
  }
}
