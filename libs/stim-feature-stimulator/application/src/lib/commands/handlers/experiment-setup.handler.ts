import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentInitializedEvent } from '../../events/impl/experiment-initialized.event';
import { ExperimentSetupCommand } from '../impl/experiment-setup.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentSetupCommand)
export class ExperimentSetupHandler extends BaseStimulatorBlockingHandler<ExperimentSetupCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(ExperimentSetupHandler.name));
  }

  protected callServiceMethod(command: ExperimentSetupCommand, commandID: number) {
    this.service.setupExperiment(commandID, command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu nastavovat nahraný experiment.');
  }

  protected done(event: StimulatorEvent) {
    this.logger.debug('Nahraný experiment byl nastaven.');
    this.eventBus.publish(new ExperimentInitializedEvent((event.data as StimulatorStateData).timestamp));
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
