import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleConfig, } from '@neuro-server/stim-feature-ipc/domain';
import { GetSettingsQuery } from '@neuro-server/stim-feature-settings';

import { IpcService } from '../../services/ipc.service';
import { IpcSpawnCommand } from '../impl/ipc-spawn.command';

@CommandHandler(IpcSpawnCommand)
export class IpcSpawnHandler implements ICommandHandler<IpcSpawnCommand> {
  private readonly logger: Logger = new Logger(IpcSpawnHandler.name);

  constructor(
    @Inject(ASSET_PLAYER_MODULE_CONFIG_CONSTANT) private readonly config: AssetPlayerModuleConfig,
    private readonly service: IpcService,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: IpcSpawnCommand): Promise<any> {
    this.logger.debug('Budu spouštět přehrávač multimédií.');
    const settings: Settings = await this.queryBus.execute(new GetSettingsQuery());
    return this.service.spawn(this.config, settings.assetPlayer);
  }
}
