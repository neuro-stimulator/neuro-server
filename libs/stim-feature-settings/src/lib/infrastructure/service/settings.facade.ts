import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Settings } from '../../domain/model/settings';
import { GetSettingsQuery } from '../../application/queries';
import { UpdateSettingsCommand } from '../../application/commands/impl/update-settings.command';

@Injectable()
export class SettingsFacade {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  public async getSettings(): Promise<Settings> {
    return this.queryBus.execute(new GetSettingsQuery());
  }

  async updateSettings(settings: Settings): Promise<void> {
    return this.commandBus.execute(new UpdateSettingsCommand(settings));
  }
}
