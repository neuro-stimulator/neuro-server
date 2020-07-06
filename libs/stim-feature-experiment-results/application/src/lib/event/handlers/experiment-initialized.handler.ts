import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ExperimentInitializedEvent } from '@diplomka-backend/stim-feature-stimulator';

import { ExperimentResultInitializeCommand } from '../../commands/impl/experiment-result-initialize.command';

@EventsHandler(ExperimentInitializedEvent)
export class ExperimentInitializedHandler implements IEventHandler<ExperimentInitializedEvent> {
  private readonly logger: Logger = new Logger(ExperimentInitializedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentInitializedEvent): Promise<void> {
    this.logger.debug('Experiment byl inicializován.');

    await this.commandBus.execute(new ExperimentResultInitializeCommand(event.timestamp));
  }
}
