import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

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

  protected callServiceMethod(command: ExperimentPauseCommand, commandID: number): Promise<void> {
    this.service.pauseExperiment(commandID, command.experimentID);
    return Promise.resolve();
  }

  protected init() {
    this.logger.debug('Budu pozastavovat běžící experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl pozastaven.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_PAUSED;
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
