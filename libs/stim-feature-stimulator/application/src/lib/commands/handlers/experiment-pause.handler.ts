import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentPauseCommand } from '../impl/experiment-pause.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentPauseCommand)
export class ExperimentPauseHandler extends BaseStimulatorBlockingHandler<ExperimentPauseCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(ExperimentPauseHandler.name));
  }

  protected callServiceMethod(command: ExperimentPauseCommand, commandID: number): Promise<void> {
    this.service.pauseExperiment(commandID, command.experimentID);
    return Promise.resolve();
  }

  protected async init(): Promise<void> {
    this.logger.debug('Budu pozastavovat běžící experiment.');
    return super.init();
  }

  protected done(): void {
    this.logger.debug('Experiment byl pozastaven.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_PAUSED;
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
