import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { PlayerService } from '../../service/player.service';
import { ProcessStimulatorIoDataCommand } from '../impl/process-stimulator-io-data.command';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';
import { CanExperimentContinueCommand } from '../../queries/impl/can-experiment-continue.command';
import { ExperimentFinishCommand } from '@diplomka-backend/stim-feature-stimulator/application';
import { SendStimulatorIoDataToClientCommand } from '../impl/to-client/send-stimulator-io-data-to-client.command';

@CommandHandler(ProcessStimulatorIoDataCommand)
export class ProcessStimulatorIoDataHandler implements ICommandHandler<ProcessStimulatorIoDataCommand, void> {
  private readonly logger: Logger = new Logger(ProcessStimulatorIoDataHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async execute(command: ProcessStimulatorIoDataCommand): Promise<void> {
    this.logger.debug('Budu zpracovávat příchozí IO data ze stimulátoru.');

    await this.commandBus.execute(new AppendExperimentResultDataCommand(command.data));

    const canContinue = await this.queryBus.execute(new CanExperimentContinueCommand());
    if (!canContinue) {
      this.logger.debug('Experiment přechází do ukončovací fáze.');
      await this.commandBus.execute(new ExperimentFinishCommand(this.service.activeExperimentResult.experimentID, true));
    } else {
      // Experiment může dál pokračovat
      await this.commandBus.execute(new SendStimulatorIoDataToClientCommand(command.data));
    }
  }
}
