import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentFinishedEvent } from '../../events/impl/experiment-finished.event';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentFinishCommand)
export class ExperimentFinishHandler extends BaseStimulatorBlockingHandler<ExperimentFinishCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, commandIdService, eventBus, new Logger(ExperimentFinishHandler.name));
  }

  protected callServiceMethod(command: ExperimentFinishCommand, commandID: number): Promise<void> {
    this.service.finishExperiment(commandID, command.experimentID);
    return Promise.resolve();
  }

  protected async init(): Promise<void> {
    this.logger.debug('Budu ukončovat běžící experiment.');
    return super.init();
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
