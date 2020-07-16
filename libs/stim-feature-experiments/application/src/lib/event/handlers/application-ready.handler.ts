import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ApplicationReadyEvent } from '@diplomka-backend/stim-lib-common';

import { RegisterDtoCommand } from '../../commands/impl/register-dto.command';

@EventsHandler(ApplicationReadyEvent)
export class ApplicationReadyHandler implements IEventHandler<ApplicationReadyEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ApplicationReadyEvent): Promise<void> {
    await this.commandBus.execute(new RegisterDtoCommand());
  }
}
