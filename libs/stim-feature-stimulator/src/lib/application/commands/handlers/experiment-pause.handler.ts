import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import {
  StimulatorEvent,
  StimulatorStateData,
} from '@diplomka-backend/stim-feature-stimulator';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentPauseCommand } from '../impl/experiment-pause.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentPauseCommand)
export class ExperimentPauseHandler extends BaseStimulatorBlockingHandler<
  ExperimentPauseCommand
> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentPauseHandler.name));
  }

  protected callServiceMethod(command: ExperimentPauseCommand) {
    this.service.clearExperiment();
  }

  protected init() {
    this.logger.debug('Budu pozastavovat běžící experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
