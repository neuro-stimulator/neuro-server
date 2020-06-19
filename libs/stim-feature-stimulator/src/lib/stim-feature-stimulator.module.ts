import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimulatorFacade } from './infrastructure/service/stimulator.facade';
import { StimulatorModuleConfig } from './domain/model/stimulator-module-config';
import { StimFeatureStimulatorCoreModule } from './stim-feature-stimulator-core.module';

@Module({})
export class StimFeatureStimulatorModule {
  static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorModule,
      imports: [StimFeatureStimulatorCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureStimulatorModule,
      imports: [CqrsModule],
      providers: [StimulatorFacade],
      exports: [StimulatorFacade],
    };
  }
}
