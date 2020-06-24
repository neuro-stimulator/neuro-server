import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import {
  StimulatorEvent,
  StimulatorStateData,
} from '@diplomka-backend/stim-feature-stimulator';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentRunCommand } from '../impl/experiment-run.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler extends BaseStimulatorBlockingHandler<
  ExperimentRunCommand
> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentRunHandler.name));
  }

  protected callServiceMethod(command: ExperimentRunCommand) {
    this.service.runExperiment(command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu spouštět experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
