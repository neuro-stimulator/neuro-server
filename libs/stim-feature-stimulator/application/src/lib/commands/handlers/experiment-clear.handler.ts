import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentClearedEvent } from '../../events/impl/experiment-cleared.event';
import { ExperimentClearCommand } from '../impl/experiment-clear.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentClearCommand)
export class ExperimentClearHandler extends BaseStimulatorBlockingHandler<ExperimentClearCommand> {
  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(ExperimentClearHandler.name));
  }

  protected callServiceMethod(command: ExperimentClearCommand, commandID: number): Promise<void> {
    this.service.clearExperiment(commandID);
    return Promise.resolve();
  }

  protected async init(command: ExperimentClearCommand): Promise<void> {
    this.logger.debug('Budu mazat paměť stimulátoru.');
    return super.init(command);
  }

  protected done(event: StimulatorEvent, command: ExperimentClearCommand): void {
    this.logger.debug('Paměť stimulátoru byla vymazána.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    this.eventBus.publish(new ExperimentClearedEvent(command.force));
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
