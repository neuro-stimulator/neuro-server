import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import { StimFeatureExperimentsInfrastructureModule } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { StimFeatureIpcModule } from '@diplomka-backend/stim-feature-ipc';

import { StimulatorEvents } from '../../application/src/lib/events';
import { StimulatorQueries } from '../../application/src/lib/queries';
import { SerialHandlers } from '../../application/src/lib/commands';
import { StimulatorSagas } from '../../application/src/lib/sagas';
import { StimulatorService } from '../../application/src/lib/service/stimulator.service';
import { CommandIdService } from '../../application/src/lib/service/command-id.service';
import { SerialFacade } from '../../infrastructure/src/lib/service/serial.facade';
import { StimulatorFacade } from '../../infrastructure/src/lib/service/stimulator.facade';
import { SerialController } from '../../infrastructure/src/lib/controllers/serial.controller';
import { StimulatorController } from '../../infrastructure/src/lib/controllers/stimulator.controller';
import { FakeSerialResponder } from '../../application/src/lib/service/serial/fake/fake-serial-responder';
import { serialProvider } from '../../application/src/lib/provider/serial-provider';
import { DefaultFakeSerialResponder } from '../../application/src/lib/service/serial/fake/fake-serial.positive-responder';
import { StimulatorModuleConfig } from '../../domain/src/lib/model/stimulator-module-config';
import { TOKEN_USE_VIRTUAL_SERIAL } from '../../domain/src/lib/tokens';

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
        StimFeatureSettingsModule.forFeature(),
        StimFeatureIpcModule,
        StimFeatureExperimentsInfrastructureModule,
      ],
      providers: [],
    };
  }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AsyncRequestHeaderMiddleware)
  //     .forRoutes(
  //       { path: '/api/stimulator/experiment/*', method: RequestMethod.PATCH },
  //       { path: '/api/stimulator/state/*', method: RequestMethod.GET },
  //       { path: '/api/stimulator/*', method: RequestMethod.OPTIONS }
  //     );
  // }
}
