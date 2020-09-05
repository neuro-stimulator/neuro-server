import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentInitializedEvent } from '../../events/impl/experiment-initialized.event';
import { ExperimentSetupCommand } from '../impl/experiment-setup.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentSetupCommand)
export class ExperimentSetupHandler extends BaseStimulatorBlockingHandler<ExperimentSetupCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(settings, eventBus, commandIdService, new Logger(ExperimentSetupHandler.name));
  }

  protected callServiceMethod(command: ExperimentSetupCommand, commandID: number): Promise<void> {
    this.service.setupExperiment(commandID, command.experimentID);
    return Promise.resolve();
  }

  protected init() {
    this.logger.debug('Budu nastavovat nahraný experiment.');
  }

  protected done(event: StimulatorEvent) {
    this.logger.debug('Nahraný experiment byl nastaven.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED;
    this.eventBus.publish(new ExperimentInitializedEvent((event.data as StimulatorStateData).timestamp));
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
