import { IEvent } from '@nestjs/cqrs';

import { Settings } from '../../../domain/model/settings';

export class SettingsWasLoadedEvent implements IEvent {
  constructor(public readonly settings: Settings) {}
}
