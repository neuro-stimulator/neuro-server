import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator, Experiment, ExperimentType, Output } from '@stechy1/diplomka-share';

import { ExperimentByIdQuery } from '@neuro-server/stim-feature-experiments/application';
import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorService } from '../../service/stimulator.service';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';

import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentUploadCommand)
export class ExperimentUploadHandler extends BaseStimulatorBlockingHandler<ExperimentUploadCommand> {
  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(ExperimentUploadHandler.name));
  }

  protected async callServiceMethod(command: ExperimentUploadCommand, commandID: number): Promise<void> {
    // Získám experiment z databáze
    const experiment: Experiment<Output> = await this.queryBus.execute(new ExperimentByIdQuery(command.userGroups, command.experimentID));
    this.logger.debug(`Experiment je typu: ${ExperimentType[experiment.type]}`);
    // Provedu serilizaci a odeslání příkazu
    this.service.uploadExperiment(experiment, commandID, command.sequenceSize);
  }

  protected async init(command: ExperimentUploadCommand): Promise<void> {
    this.logger.debug('Budu nahrávat experiment.');
    return super.init(command);
  }

  protected done(): void {
    this.logger.debug('Experiment byl nahrán.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED;
  }

  protected isValid(event: StimulatorEvent): boolean {
    return event.data.name === StimulatorStateData.name;
  }
}
