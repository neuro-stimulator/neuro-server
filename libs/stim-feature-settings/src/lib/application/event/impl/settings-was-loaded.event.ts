import { IEvent } from '@nestjs/cqrs';

import { Settings } from '@stechy1/diplomka-share';

export class SettingsWasLoadedEvent implements IEvent {
  constructor(public readonly settings: Settings) {}
}
