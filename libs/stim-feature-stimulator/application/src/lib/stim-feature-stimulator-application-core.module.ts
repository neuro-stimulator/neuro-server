import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimulatorModuleConfig, TOKEN_USE_VIRTUAL_SERIAL } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from './service/stimulator.service';
import { CommandIdService } from './service/command-id.service';
import { serialProvider } from './provider/serial-provider';
import { FakeSerialResponder } from './service/serial/fake/fake-serial-responder';
import { DefaultFakeSerialResponder } from './service/serial/fake/fake-serial.positive-responder';
import { SerialHandlers } from './commands';
import { StimulatorQueries } from './queries';
import { StimulatorEvents } from './events';
import { StimulatorSagas } from './sagas';

@Module({})
export class StimFeatureStimulatorApplicationCoreModule {
  public static forRoot(config: StimulatorModuleConfig): DynamicModule {
    return {
      module: StimFeatureStimulatorApplicationCoreModule,
      imports: [CqrsModule],
      providers: [
        StimulatorService,
        CommandIdService,
        serialProvider,

        {
          provide: FakeSerialResponder,
          useClass: DefaultFakeSerialResponder,
        },
        {
          provide: TOKEN_USE_VIRTUAL_SERIAL,
          useValue: config.useVirtualSerial,
        },

        ...SerialHandlers,
        ...StimulatorQueries,
        ...StimulatorEvents,
        ...StimulatorSagas,
      ],

      exports: [TOKEN_USE_VIRTUAL_SERIAL],
    };
  }
}
