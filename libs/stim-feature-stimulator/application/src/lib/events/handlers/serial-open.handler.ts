import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { StimulatorStateCommand } from '../../commands/impl/stimulator-state.command';
import { SerialOpenEvent } from '../impl/serial-open.event';

@EventsHandler(SerialOpenEvent)
export class SerialOpenHandler implements IEventHandler<SerialOpenEvent> {
  private readonly logger: Logger = new Logger(SerialOpenHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SerialOpenEvent): Promise<void> {
    this.logger.debug('Budu odesílat asynchronní požadavek na získání stavu stimulátoru.');
    await this.commandBus.execute(new StimulatorStateCommand(false));
  }
}
