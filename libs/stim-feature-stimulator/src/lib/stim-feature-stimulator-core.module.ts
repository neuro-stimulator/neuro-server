import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentsModule } from '@diplomka-backend/stim-feature-experiments';

import { StimulatorEvents } from './application/events';
import { StimulatorQueries } from './application/queries';
import { SerialHandlers } from './application/commands';
import { StimulatorSagas } from './application/sagas';
import { StimulatorService } from './domain/service/stimulator.service';
import { SerialFacade } from './infrastructure/service/serial.facade';
import { StimulatorFacade } from './infrastructure/service/stimulator.facade';
import { SerialController } from './infrastructure/controllers/serial.controller';
import { StimulatorController } from './infrastructure/controllers/stimulator.controller';
import { FakeSerialResponder } from './domain/service/serial/fake/fake-serial-responder';
import { serialProvider } from './domain/provider/serial-provider';
import { DefaultFakeSerialResponder } from './domain/service/serial/fake/fake-serial.positive-responder';
import { StimulatorModuleConfig } from './domain/model/stimulator-module-config';
import { TOKEN_USE_VIRTUAL_SERIAL } from './domain/tokens';

@Module({})
export class StimFeatureStimulatorCoreModule {
  static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorCoreModule,
      controllers: [SerialController, StimulatorController],
      imports: [
        CqrsModule,
        StimLibSocketModule,
        StimFeatureFileBrowserModule.forFeature(),
        StimFeatureExperimentsModule,
      ],
      providers: [
        {
          provide: FakeSerialResponder,
          useClass: DefaultFakeSerialResponder,
        },
        {
          provide: TOKEN_USE_VIRTUAL_SERIAL,
          useValue: config.useVirtualSerial,
        },

        serialProvider,
        StimulatorService,
        SerialFacade,
        StimulatorFacade,

        ...SerialHandlers,
        ...StimulatorQueries,
        ...StimulatorEvents,
        ...StimulatorSagas,
      ],
      exports: [TOKEN_USE_VIRTUAL_SERIAL],
    };
  }
}
