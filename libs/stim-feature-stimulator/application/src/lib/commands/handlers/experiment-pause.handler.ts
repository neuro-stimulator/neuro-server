import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentPauseCommand } from '../impl/experiment-pause.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentPauseCommand)
export class ExperimentPauseHandler extends BaseStimulatorBlockingHandler<ExperimentPauseCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(ExperimentPauseHandler.name));
  }

  protected callServiceMethod(command: ExperimentPauseCommand, commandID: number) {
    this.service.pauseExperiment(commandID, command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu pozastavovat běžící experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl pozastaven.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
