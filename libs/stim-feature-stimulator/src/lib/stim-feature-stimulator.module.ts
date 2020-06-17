import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

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

@Module({
  controllers: [SerialController, StimulatorController],
  imports: [
    CqrsModule,
    StimFeatureFileBrowserModule.forFeature(),
    StimFeatureExperimentsModule,
  ],
  providers: [
    {
      provide: FakeSerialResponder,
      useClass: DefaultFakeSerialResponder,
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
  exports: [StimulatorFacade],
})
export class StimFeatureStimulatorModule {}
