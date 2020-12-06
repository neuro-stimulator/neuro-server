import { ICommand } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

export class UpdateSettingsCommand implements ICommand {
  constructor(public readonly settings: Settings) {}
}
