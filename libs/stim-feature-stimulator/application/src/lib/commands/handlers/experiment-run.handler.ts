import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentRunCommand } from '../impl/experiment-run.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler extends BaseStimulatorBlockingHandler<ExperimentRunCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, eventBus, commandIdService, new Logger(ExperimentRunHandler.name));
  }

  protected callServiceMethod(command: ExperimentRunCommand, commandID: number): Promise<void> {
    this.service.runExperiment(commandID, command.experimentID);
    return Promise.resolve();
  }

  protected init() {
    this.logger.debug('Budu spouštět experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl spuštěn.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING;
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
