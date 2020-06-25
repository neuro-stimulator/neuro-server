import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Settings } from '../../../domain/model/settings';
import { SettingsService } from '../../../domain/services/settings.service';
import { GetSettingsQuery } from '../impl/get-settings.query';

@QueryHandler(GetSettingsQuery)
export class GetSettingsHandler
  implements IQueryHandler<GetSettingsQuery, Settings> {
  private readonly logger: Logger = new Logger(GetSettingsHandler.name);

  constructor(private readonly service: SettingsService) {}
  async execute(query: GetSettingsQuery): Promise<Settings> {
    this.logger.debug(
      'Zpracovávám požadavek na získání uživatelského serverového nastavení.'
    );
    return this.service.settings;
  }
}
