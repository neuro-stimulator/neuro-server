import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentRunCommand } from '../impl/experiment-run.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler extends BaseStimulatorBlockingHandler<ExperimentRunCommand> {
  constructor(private readonly service: StimulatorService, eventBus: EventBus) {
    super(eventBus, new Logger(ExperimentRunHandler.name));
  }

  protected callServiceMethod(command: ExperimentRunCommand) {
    this.service.runExperiment(command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu spouštět experiment.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
