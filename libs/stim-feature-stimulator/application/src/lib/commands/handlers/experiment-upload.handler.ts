import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator, Experiment, ExperimentType, Output } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments/application';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentUploadCommand)
export class ExperimentUploadHandler extends BaseStimulatorBlockingHandler<ExperimentUploadCommand> {
  constructor(private readonly service: StimulatorService, settings: SettingsFacade, commandIdService: CommandIdService, eventBus: EventBus, private readonly queryBus: QueryBus) {
    super(settings, commandIdService, eventBus, new Logger(ExperimentUploadHandler.name));
  }

  protected async callServiceMethod(command: ExperimentUploadCommand, commandID: number): Promise<void> {
    // Získám experiment z databáze
    const experiment: Experiment<Output> = await this.queryBus.execute(new ExperimentByIdQuery(command.experimentID, command.userID));
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
