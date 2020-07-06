import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IOEvent } from '@stechy1/diplomka-share';

import { StimulatorIoChangeData } from '@diplomka-backend/stim-feature-stimulator';

import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';

@CommandHandler(FillInitialIoDataCommand)
export class FillInitialIoDataHandler implements ICommandHandler<FillInitialIoDataCommand, void> {
  private readonly logger: Logger = new Logger(FillInitialIoDataHandler.name);

  constructor(private readonly service: ExperimentResultsService, private readonly commandBus: CommandBus) {}

  async execute(command: FillInitialIoDataCommand): Promise<void> {
    this.logger.debug('Budu naplňovat inicializovaná data základními hodnotami.');
    const experimentResult = this.service.activeExperimentResult;

    const outputCount = experimentResult.outputCount;

    for (let i = 0; i < outputCount; i++) {
      const data: IOEvent = {
        name: StimulatorIoChangeData.name,
        ioType: 'output',
        state: 'off',
        index: i,
        timestamp: command.timestamp,
      };
      await this.commandBus.execute(new AppendExperimentResultDataCommand(data));
    }
  }
}
