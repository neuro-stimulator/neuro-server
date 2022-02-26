import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ExperimentClearCommand,
  ExperimentSetupCommand,
  ExperimentUploadCommand,
  SendStimulatorStateChangeToClientCommand,
} from '@neuro-server/stim-feature-stimulator/application';
import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';

import { PlayerService } from '../../service/player.service';
import { PrepareNextExperimentRoundCommand } from '../impl/prepare-next-experiment-round.command';

@CommandHandler(PrepareNextExperimentRoundCommand)
export class PrepareNextExperimentRoundHandler implements ICommandHandler<PrepareNextExperimentRoundCommand, void> {
  private readonly logger: Logger = new Logger(PrepareNextExperimentRoundHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async execute(command: PrepareNextExperimentRoundCommand): Promise<void> {
    this.logger.debug('Budu připravovat přehrávač na další kolo experimentu.');
    this.logger.debug('1. Vymažu aktuální experiment ze stimulátoru.');
    await this.commandBus.execute(new ExperimentClearCommand(true));
    this.logger.debug('3. Nahraji znovu experiment do stimulátoru.');
    await this.commandBus.execute(new ExperimentUploadCommand(command.userGroups, this.service.activeExperimentResult.experimentID, this.service.sequence?.size, true));
    this.logger.debug('4. Inicializuji experiment ve stimulátoru.');
    const state: StimulatorStateData = await this.commandBus.execute(new ExperimentSetupCommand(this.service.activeExperimentResult.experimentID, true));
    await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(state.state));
  }
}
