import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { TOKEN_COMMUNICATION_PORT, TOKEN_FRAME_RATE, TOKEN_PATH_TO_MAIN, TOKEN_PATH_TO_PYTHON } from '@diplomka-backend/stim-feature-ipc/domain';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { IpcService } from '../../services/ipc.service';
import { IpcSpawnCommand } from '../impl/ipc-spawn.command';

@CommandHandler(IpcSpawnCommand)
export class IpcSpawnHandler implements ICommandHandler<IpcSpawnCommand> {
  private readonly logger: Logger = new Logger(IpcSpawnHandler.name);

  constructor(
    @Inject(TOKEN_PATH_TO_PYTHON) private readonly pathToPython: string,
    @Inject(TOKEN_PATH_TO_MAIN) private readonly pathToMain: string,
    @Inject(TOKEN_COMMUNICATION_PORT) private readonly communicationPort: number,
    @Inject(TOKEN_FRAME_RATE) private readonly frameRate: number,
    private readonly service: IpcService,
    private readonly facade: SettingsFacade
  ) {}

  async execute(command: IpcSpawnCommand): Promise<any> {
    this.logger.debug('Budu spouštět přehrávač multimédií.');
    const settings: Settings = await this.facade.getSettings();
    return this.service.spawn(this.pathToPython, this.pathToMain, this.communicationPort, this.frameRate, settings.assetPlayer);
  }
}
