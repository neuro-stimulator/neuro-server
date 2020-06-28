import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler extends BaseStimulatorBlockingHandler<ExperimentFinishCommand> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentFinishHandler.name));
  }

  protected callServiceMethod(command: ExperimentFinishCommand) {
    this.service.finishExperiment(command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu ukončovat běžící experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
