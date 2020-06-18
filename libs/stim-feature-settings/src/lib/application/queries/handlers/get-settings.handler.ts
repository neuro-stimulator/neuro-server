import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Settings } from '../../../domain/model/settings';
import { SettingsService } from '../../../domain/services/settings.service';
import { GetSettingsQuery } from '../impl/get-settings.query';

@QueryHandler(GetSettingsQuery)
export class GetSettingsHandler
  implements IQueryHandler<GetSettingsQuery, Settings> {
  constructor(private readonly service: SettingsService) {}
  async execute(query: GetSettingsQuery): Promise<Settings> {
    return this.service.settings;
  }
}
