import { ICommand } from '@nestjs/cqrs';

import { Settings } from '../../../domain/model/settings';

export class UpdateSettingsCommand implements ICommand {
  constructor(public readonly settings: Settings) {}
}
