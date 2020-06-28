import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentSetupCommand } from '../impl/experiment-setup.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentSetupCommand)
export class ExperimentSetupHandler extends BaseStimulatorBlockingHandler<ExperimentSetupCommand> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentSetupHandler.name));
  }

  protected callServiceMethod(command: ExperimentSetupCommand) {
    this.service.setupExperiment(command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu nastavovat nahraný experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
