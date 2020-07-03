import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { StimulatorStateData } from '../../../domain/model/stimulator-command-data/stimulator-state.data';
import { CommandIdService } from '../../../domain/service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentRunCommand } from '../impl/experiment-run.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler extends BaseStimulatorBlockingHandler<ExperimentRunCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(ExperimentRunHandler.name));
  }

  protected callServiceMethod(command: ExperimentRunCommand, commandID: number) {
    this.service.runExperiment(commandID, command.experimentID);
  }

  protected init() {
    this.logger.debug('Budu spouštět experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl spuštěn.');
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
