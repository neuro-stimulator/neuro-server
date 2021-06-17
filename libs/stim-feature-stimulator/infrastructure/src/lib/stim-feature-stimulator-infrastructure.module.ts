import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimulatorFacade } from './service/stimulator.facade';
import { StimFeatureStimulatorInfrastructureCoreModule } from './stim-feature-stimulator-infrastructure-core.module';

@Module({})
export class StimFeatureStimulatorInfrastructureModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureStimulatorInfrastructureModule,
      imports: [StimFeatureStimulatorInfrastructureCoreModule.forRootAsync()],
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
