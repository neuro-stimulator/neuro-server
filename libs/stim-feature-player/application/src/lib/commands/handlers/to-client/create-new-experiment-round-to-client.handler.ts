import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SocketMessageSpecialization } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { CreateNewExperimentRoundToClientCommand } from '../../impl/to-client/create-new-experiment-round-to-client.command';

@CommandHandler(CreateNewExperimentRoundToClientCommand)
export class CreateNewExperimentRoundToClientHandler implements ICommandHandler<CreateNewExperimentRoundToClientCommand, void> {
  private readonly logger: Logger = new Logger(CreateNewExperimentRoundToClientHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: CreateNewExperimentRoundToClientCommand): Promise<void> {
    this.logger.debug('Budu odesílat příkaz na založení nového kola měření experimentu klientovi.');
    await this.facade.broadcastCommand({
      specialization: SocketMessageSpecialization.EXPERIMENT_PLAYER,
      type: 99,
      data: {},
    });
  }
}
