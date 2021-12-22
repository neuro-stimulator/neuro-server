import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';
import { DTOs } from '@neuro-server/stim-feature-experiments/domain';

import { ExperimentsRegisterDtoCommand } from '../../commands/impl/experiments-register-dto.command';

@EventsHandler(ApplicationReadyEvent)
export class ExperimentsApplicationReadyHandler implements IEventHandler<ApplicationReadyEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(_event: ApplicationReadyEvent): Promise<void> {
    await this.commandBus.execute(new ExperimentsRegisterDtoCommand(DTOs));
  }
}
