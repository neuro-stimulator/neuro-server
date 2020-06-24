import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import {
  StimulatorEvent,
  StimulatorStateData,
} from '@diplomka-backend/stim-feature-stimulator';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler extends BaseStimulatorBlockingHandler<
  ExperimentFinishCommand
> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentFinishHandler.name));
  }

  protected callServiceMethod(command: ExperimentFinishCommand) {
    this.service.clearExperiment();
  }

  protected init() {
    this.logger.debug('Budu ukončovat běžící experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
