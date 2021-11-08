import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureStimulatorApplicationModule } from '@neuro-server/stim-feature-stimulator/application';
import { StimFeatureAuthApplicationModule } from '@neuro-server/stim-feature-auth/application';

import { SerialController } from './controllers/serial.controller';
import { StimulatorController } from './controllers/stimulator.controller';
import { SerialFacade } from './service/serial.facade';
import { StimulatorFacade } from './service/stimulator.facade';
import { StimulatorActionGuard } from './guard/stimulator-action.guard';

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
