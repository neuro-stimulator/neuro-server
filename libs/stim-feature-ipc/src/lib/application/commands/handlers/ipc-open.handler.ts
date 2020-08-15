import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Settings, SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { IpcService } from '../../services/ipc.service';
import { IpcOpenCommand } from '../impl/ipc-open.command';

@CommandHandler(IpcOpenCommand)
export class IpcOpenHandler implements ICommandHandler<IpcOpenCommand, void> {
  private readonly logger: Logger = new Logger(IpcOpenHandler.name);

  constructor(private readonly service: IpcService, private readonly facade: SettingsFacade) {}

  async execute(command: IpcOpenCommand): Promise<void> {
    this.logger.debug('Budu otevírat komunikační PIPE');
    this.logger.debug('1. Získám cestu k pipe.');
    const settings: Settings = await this.facade.getSettings();
    this.logger.debug(`{ipcPipe=${settings.ipcPipe}}`);
    this.service.open();
  }
}
