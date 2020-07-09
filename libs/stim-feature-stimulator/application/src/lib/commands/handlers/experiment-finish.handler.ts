import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentFinishedEvent } from '../../events/impl/experiment-finished.event';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler extends BaseStimulatorBlockingHandler<ExperimentFinishCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(ExperimentFinishHandler.name));
  }

  protected callServiceMethod(command: ExperimentFinishCommand, commandID: number) {
    this.service.finishExperiment(commandID, command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu ukončovat běžící experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl úspěšně ukončen.');
    this.eventBus.publish(new ExperimentFinishedEvent());
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
