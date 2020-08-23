import { CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { StartNewExperimentRoundCommand } from '../impl/start-new-experiment-round.command';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';
import { CreateNewExperimentRoundToClientCommand } from '../impl/to-client/create-new-experiment-round-to-client.command';
import { SendAssetConfigurationToIpcCommand } from '../impl/to-ipc/send-asset-configuration-to-ipc.command';

@CommandHandler(StartNewExperimentRoundCommand)
export class StartNewExperimentRoundHandler implements ICommandHandler<StartNewExperimentRoundCommand, void> {
  private readonly logger: Logger = new Logger(StartNewExperimentRoundHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: StartNewExperimentRoundCommand): Promise<void> {
    this.logger.debug('Budu zakládat nové kolo měření experimentu.');

    // Upozorním klienta, že má založit nové kolo měření
    await this.commandBus.execute(new CreateNewExperimentRoundToClientCommand());
    // Vyplním initial io data
    await this.commandBus.execute(new FillInitialIoDataCommand(command.timestamp));
    await this.commandBus.execute(new SendAssetConfigurationToIpcCommand());
  }
}
