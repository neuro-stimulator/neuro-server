import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { ExperientAssetsMessage, IpcFacade, IpcSendMessageCommand } from '@diplomka-backend/stim-feature-ipc';
import { GetCurrentExperimentIdQuery } from '@diplomka-backend/stim-feature-stimulator/application';
import { ExperimentMultimediaQuery } from '@diplomka-backend/stim-feature-experiments/application';

import { SendAssetConfigurationToIpcCommand } from '../../impl/to-ipc/send-asset-configuration-to-ipc.command';

@CommandHandler(SendAssetConfigurationToIpcCommand)
export class SendAssetConfigurationToIpcHandler implements ICommandHandler<SendAssetConfigurationToIpcCommand, void> {
  private readonly logger: Logger = new Logger(SendAssetConfigurationToIpcHandler.name);

  constructor(private readonly facade: IpcFacade, private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async execute(command: SendAssetConfigurationToIpcCommand): Promise<void> {
    this.logger.debug('Budu odesílat IPC klientovi konfiguraci assetů pro aktuální experiment.');

    this.logger.debug('1. Získám ID aktuálního experimentu.');
    const experimentID: number = await this.queryBus.execute(new GetCurrentExperimentIdQuery());
    this.logger.debug('2. Získám konfiguraci assetů aktuálního experimentu.');
    const multimedia = await this.queryBus.execute(new ExperimentMultimediaQuery(experimentID));

    this.logger.debug('3. Odešlu IPC klientovi konfiguraci obrázků a zvuků experimentu.');
    // Odešlu IPC klientovi konfiguraci obrázků a zvuků experimentu
    await this.commandBus.execute(new IpcSendMessageCommand(new ExperientAssetsMessage(multimedia)));
  }
}
