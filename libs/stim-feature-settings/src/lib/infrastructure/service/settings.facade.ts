import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

import { UpdateSettingsCommand } from '../../application/commands/impl/update-settings.command';
import { GetSettingsQuery } from '../../application/queries/impl/get-settings.query';

@Injectable()
export class SettingsFacade {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  public async getSettings(): Promise<Settings> {
    return this.queryBus.execute(new GetSettingsQuery());
  }

  async updateSettings(settings: Settings): Promise<void> {
    return this.commandBus.execute(new UpdateSettingsCommand(settings));
  }
}
