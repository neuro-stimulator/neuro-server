import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { SendExperimentResultCreatedToClientCommand } from '../../commands/impl/to-client/send-experiment-result-created-to-client.command';
import { ExperimentResultWasCreatedEvent } from '../impl/experiment-result-was-created.event';

@EventsHandler(ExperimentResultWasCreatedEvent)
export class ExperimentResultWasCreatedHandler implements IEventHandler<ExperimentResultWasCreatedEvent> {
  private readonly logger: Logger = new Logger(ExperimentResultWasCreatedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentResultWasCreatedEvent): Promise<void> {
    this.logger.debug(`Byl vytvořen nový výsledek experimentu s ID: ${event.experimentResultID}.`);

    await this.commandBus.execute(new SendExperimentResultCreatedToClientCommand(event.experimentResultID));
  }
}
