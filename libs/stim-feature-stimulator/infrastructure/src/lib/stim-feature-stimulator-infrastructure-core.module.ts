import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureStimulatorApplicationModule } from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorModuleConfig, StimFeatureStimulatorDomainModule } from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialController } from './controllers/serial.controller';
import { StimulatorController } from './controllers/stimulator.controller';
import { SerialFacade } from './service/serial.facade';
import { StimulatorFacade } from './service/stimulator.facade';

@Module({})
export class StimFeatureStimulatorInfrastructureCoreModule {
  static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorInfrastructureCoreModule,
      controllers: [SerialController, StimulatorController],
      imports: [StimFeatureStimulatorDomainModule, StimFeatureStimulatorApplicationModule.forRoot(config), CqrsModule],
      providers: [SerialFacade, StimulatorFacade],
    };
  }
}
