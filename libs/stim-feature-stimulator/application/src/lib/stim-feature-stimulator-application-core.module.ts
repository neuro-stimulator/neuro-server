import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureSettingsModule } from '@neuro-server/stim-feature-settings';
import { StimFeatureStimulatorDomainModule } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService, createCommandIdFactory } from '@neuro-server/stim-lib-common';
import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';

import { SerialHandlers } from './commands';
import { StimulatorEvents } from './events';
import { serialPortFactoryProvider } from './provider/serial-port-factory.provider';
import { serialServiceProvider } from './provider/serial-service.provider';
import { StimulatorQueries } from './queries';
import { StimulatorSagas } from './sagas';
import { FakeSerialResponder } from './service/serial/fake/fake-serial-responder';
import { DefaultFakeSerialResponder } from './service/serial/fake/fake-serial.positive-responder';
import { FakeStimulatorDevice } from './service/serial/fake/fake-stimulator.device';
import { StimulatorService } from './service/stimulator.service';

@Module({})
export class StimFeatureStimulatorApplicationCoreModule {
  public static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureStimulatorApplicationCoreModule,
      imports: [
        CqrsModule,
        StimFeatureStimulatorDomainModule.forRootAsync(),
        StimFeatureSettingsModule.forFeature(),
        StimLibSocketModule],
      providers: [
        StimulatorService,
        FakeStimulatorDevice,
        serialPortFactoryProvider,
        serialServiceProvider,

        {
          provide: CommandIdService,
          useFactory: createCommandIdFactory(StimFeatureStimulatorApplicationCoreModule.name),
        },
        {
          provide: FakeSerialResponder,
          useClass: DefaultFakeSerialResponder,
        },

        ...SerialHandlers,
        ...StimulatorQueries,
        ...StimulatorEvents,
        ...StimulatorSagas,
      ],
    };
  }
}
