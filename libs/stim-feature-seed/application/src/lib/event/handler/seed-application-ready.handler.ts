import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';

import { SeedCommand } from '../../command/impl/seed.command';

@EventsHandler(ApplicationReadyEvent)
export class SeedApplicationReadyHandler implements IEventHandler<ApplicationReadyEvent> {
  private readonly logger: Logger = new Logger(SeedApplicationReadyHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ApplicationReadyEvent): Promise<void> {
    if (process.env.SETUP_SEED_DATABASE === 'true') {
      this.logger.debug('Budu seedovat databázi hned po startu aplikace.');
      await this.commandBus.execute(new SeedCommand());
    }
  }
}
