import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { ExperimentFinishedEvent } from '../../events/impl/experiment-finished.event';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorService } from '../../service/stimulator.service';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';

import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler extends BaseStimulatorBlockingHandler<ExperimentFinishCommand> {
  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(ExperimentFinishHandler.name));
  }

  protected callServiceMethod(command: ExperimentFinishCommand, commandID: number): Promise<void> {
    this.service.finishExperiment(command.experimentID, commandID);
    return Promise.resolve();
  }

  protected async init(command: ExperimentFinishCommand): Promise<void> {
    this.logger.debug('Budu ukončovat běžící experiment.');
    return super.init(command);
  }

  protected done(event: StimulatorEvent, command: ExperimentFinishCommand): void {
    this.logger.debug('Experiment byl úspěšně ukončen.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED;
    this.eventBus.publish(new ExperimentFinishedEvent(command.force));
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
