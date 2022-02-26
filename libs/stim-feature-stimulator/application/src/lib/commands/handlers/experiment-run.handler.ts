import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorService } from '../../service/stimulator.service';
import { ExperimentRunCommand } from '../impl/experiment-run.command';

import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentRunCommand)
export class ExperimentRunHandler extends BaseStimulatorBlockingHandler<ExperimentRunCommand> {
  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(ExperimentRunHandler.name));
  }

  protected callServiceMethod(command: ExperimentRunCommand, commandID: number): Promise<void> {
    this.service.runExperiment(command.experimentID, commandID);
    return Promise.resolve();
  }

  protected async init(command: ExperimentRunCommand): Promise<void> {
    this.logger.debug('Budu spouštět experiment.');
    return super.init(command);
  }

  protected done(): void {
    this.logger.debug('Experiment byl spuštěn.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_RUNNING;
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
