import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentFinishCommand } from '@diplomka-backend/stim-feature-stimulator/application';

import { PlayerService } from '../../service/player.service';
import { ProcessStimulatorIoDataCommand } from '../impl/process-stimulator-io-data.command';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';
import { SendStimulatorIoDataToClientCommand } from '../impl/to-client/send-stimulator-io-data-to-client.command';

@CommandHandler(ProcessStimulatorIoDataCommand)
export class ProcessStimulatorIoDataHandler implements ICommandHandler<ProcessStimulatorIoDataCommand, void> {
  private readonly logger: Logger = new Logger(ProcessStimulatorIoDataHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async execute(command: ProcessStimulatorIoDataCommand): Promise<void> {
    this.logger.debug('Budu zpracovávat příchozí IO data ze stimulátoru.');

    await this.commandBus.execute(new AppendExperimentResultDataCommand(command.data));

    if (!this.service.canExperimentContinue) {
      this.logger.debug('Experiment přechází do ukončovací fáze.');
      await this.commandBus.execute(new ExperimentFinishCommand(this.service.activeExperimentResult.experimentID, true));
    } else {
      // Experiment může dál pokračovat
      await this.commandBus.execute(new SendStimulatorIoDataToClientCommand(command.data));
    }
  }
}
