import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentResultCreatedMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { SendExperimentResultCreatedToClientCommand } from '../../impl/to-client/send-experiment-result-created-to-client.command';

@CommandHandler(SendExperimentResultCreatedToClientCommand)
export class SendExperimentResultCreatedToClientHandler implements ICommandHandler<SendExperimentResultCreatedToClientCommand, void> {
  private readonly logger: Logger = new Logger(SendExperimentResultCreatedToClientHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendExperimentResultCreatedToClientCommand): Promise<void> {
    this.logger.debug('Budu broadcastovat klientům ID nového výsledku experimentu.');

    await this.facade.broadcastCommand(new ExperimentResultCreatedMessage(command.experimentResultID));
  }
}
