import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';

import { LoadSettingsCommand } from '../../commands/impl/load-settings.command';

@EventsHandler(ApplicationReadyEvent)
export class SettingsApplicationReadyHandler implements IEventHandler<ApplicationReadyEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ApplicationReadyEvent): Promise<void> {
    await this.commandBus.execute(new LoadSettingsCommand());
  }
}
