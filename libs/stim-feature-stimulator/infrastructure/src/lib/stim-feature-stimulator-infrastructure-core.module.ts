import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureAuthApplicationModule } from '@neuro-server/stim-feature-auth/application';
import { StimFeatureStimulatorApplicationModule } from '@neuro-server/stim-feature-stimulator/application';

import { SerialController } from './controller/serial.controller';
import { StimulatorController } from './controller/stimulator.controller';
import { StimulatorActionGuard } from './guard/stimulator-action.guard';
import { SerialFacade } from './service/serial.facade';
import { StimulatorFacade } from './service/stimulator.facade';

@Module({})
export class StimFeatureStimulatorInfrastructureCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureStimulatorInfrastructureCoreModule,
      controllers: [SerialController, StimulatorController],
      imports: [CqrsModule, StimFeatureStimulatorApplicationModule.forRootAsync(), StimFeatureAuthApplicationModule.forFeature()],
      providers: [SerialFacade, StimulatorFacade, StimulatorActionGuard],
    };
  }
}
