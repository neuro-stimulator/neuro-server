import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FillInitialIoDataCommand } from '../../commands/impl/fill-initial-io-data.command';
import { ExperimentResultWasInitializedEvent } from '../impl/experiment-result-was-initialized.event';

@EventsHandler(ExperimentResultWasInitializedEvent)
export class ExperimentResultWasInitializedHandler implements IEventHandler<ExperimentResultWasInitializedEvent> {
  private readonly logger: Logger = new Logger(ExperimentResultWasInitializedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: ExperimentResultWasInitializedEvent): Promise<any> {
    this.logger.debug('Výsledek experimentu byl úspěšně inicializován.');
    // await this.commandBus.execute(new FillInitialIoDataCommand(event.timestamp));
  }
}
