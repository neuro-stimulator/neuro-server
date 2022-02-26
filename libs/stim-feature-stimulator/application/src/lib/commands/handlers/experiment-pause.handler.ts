import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorService } from '../../service/stimulator.service';
import { ExperimentPauseCommand } from '../impl/experiment-pause.command';

import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentPauseCommand)
export class ExperimentPauseHandler extends BaseStimulatorBlockingHandler<ExperimentPauseCommand> {
  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(ExperimentPauseHandler.name));
  }

  protected callServiceMethod(command: ExperimentPauseCommand, commandID: number): Promise<void> {
    this.service.pauseExperiment(command.experimentID, commandID);
    return Promise.resolve();
  }

  protected async init(command: ExperimentPauseCommand): Promise<void> {
    this.logger.debug('Budu pozastavovat běžící experiment.');
    return super.init(command);
  }

  protected done(): void {
    this.logger.debug('Experiment byl pozastaven.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_PAUSED;
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
