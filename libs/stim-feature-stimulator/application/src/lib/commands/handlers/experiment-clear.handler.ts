import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentClearedEvent } from '../../events/impl/experiment-cleared.event';
import { ExperimentClearCommand } from '../impl/experiment-clear.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentClearCommand)
export class ExperimentClearHandler extends BaseStimulatorBlockingHandler<ExperimentClearCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, eventBus, commandIdService, new Logger(ExperimentClearHandler.name));
  }

  protected callServiceMethod(command: ExperimentClearCommand, commandID: number): Promise<void> {
    this.service.clearExperiment(commandID);
    return Promise.resolve();
  }

  protected init() {
    this.logger.debug('Budu mazat paměť stimulátoru.');
  }

  protected done(event: StimulatorEvent, command: ExperimentClearCommand) {
    this.logger.debug('Paměť stimulátoru byla vymazána.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    this.eventBus.publish(new ExperimentClearedEvent(command.force));
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
